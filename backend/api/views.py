from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import News, Category, Product
from .serializers import NewsSerializer, CategorySerializer, ProductSerializer


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
