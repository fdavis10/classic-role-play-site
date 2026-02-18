from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    NewsViewSet, CategoryViewSet, ProductViewSet,
    register, login, verify_email, resend_verification_email, get_current_user
)

router = DefaultRouter()
router.register(r'news', NewsViewSet, basename='news')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-email/<str:token>/', verify_email, name='verify_email'),
    path('auth/resend-verification/', resend_verification_email, name='resend_verification'),
    path('auth/me/', get_current_user, name='get_current_user'),
]
