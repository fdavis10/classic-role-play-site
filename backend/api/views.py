from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
import logging
from .models import News, Category, Product, User
from .serializers import NewsSerializer, CategorySerializer, ProductSerializer, UserRegistrationSerializer, UserSerializer
from .utils import send_verification_email

logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            return Response({
                'message': 'Регистрация успешна! Проверьте вашу почту для подтверждения email.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f'Ошибка при создании пользователя: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    errors = {}
    for field, error_list in serializer.errors.items():
        if isinstance(error_list, list):
            errors[field] = error_list[0] if error_list else 'Ошибка валидации'
        else:
            errors[field] = error_list
    
    return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Необходимо указать username и password'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_email_verified:
        return Response({'error': 'Email не подтвержден. Проверьте вашу почту.'}, status=status.HTTP_403_FORBIDDEN)
    
    if not user.is_active:
        return Response({'error': 'Аккаунт деактивирован'}, status=status.HTTP_403_FORBIDDEN)
    
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_email(request, token):
    if not token:
        return Response({'error': 'Токен не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email_verification_token=token)
        
        if user.is_email_verified:
            return Response({'message': 'Email уже подтвержден. Вы можете войти в систему.'}, status=status.HTTP_200_OK)
        
        if user.email_verification_sent_at:
            time_diff = timezone.now() - user.email_verification_sent_at
            if time_diff > timedelta(days=1):
                return Response({'error': 'Срок действия ссылки истек. Запросите новую ссылку.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_email_verified = True
        user.email_verification_token = None
        user.save()
        
        return Response({'message': 'Email успешно подтвержден! Теперь вы можете войти в систему.'}, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        logger.warning(f'Токен подтверждения не найден: {token[:20]}...')
        
        users_without_token = User.objects.filter(email_verification_token__isnull=True, is_email_verified=True)
        if users_without_token.exists():
            logger.info('Найдены пользователи с подтвержденным email без токена. Возможно, это повторный запрос после успешного подтверждения.')
            return Response({'message': 'Email уже был подтвержден ранее. Вы можете войти в систему.'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Неверная или устаревшая ссылка подтверждения. Токен не найден или уже использован.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f'Ошибка при подтверждении email: {str(e)}')
        return Response({'error': f'Ошибка при подтверждении email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification_email(request):
    user = request.user
    
    if user.is_email_verified:
        return Response({'message': 'Email уже подтвержден'}, status=status.HTTP_400_BAD_REQUEST)
    
    token = user.generate_email_verification_token()
    send_verification_email(user, token)
    
    return Response({'message': 'Письмо с подтверждением отправлено на ваш email'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserSerializer(request.user).data)


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['date', 'created_at']
    ordering = ['-date', '-created_at']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = News.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['category', 'currency', 'is_available']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    search_fields = ['name', 'description']

    def get_queryset(self):
        queryset = Product.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_available=True)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_slug = request.query_params.get('category', None)
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                products = self.get_queryset().filter(category=category)
                serializer = self.get_serializer(products, many=True)
                return Response(serializer.data)
            except Category.DoesNotExist:
                return Response({'error': 'Категория не найдена'}, status=404)
        return Response({'error': 'Не указана категория'}, status=400)
