from django.db import models
from django.utils import timezone


class News(models.Model):
    title = models.CharField(max_length=200, verbose_name='Заголовок')
    description = models.TextField(verbose_name='Описание')
    link = models.URLField(max_length=200, blank=True, null=True, verbose_name='Ссылка')
    date = models.DateField(default=timezone.now, verbose_name='Дата')
    image = models.ImageField(upload_to='news/', blank=True, null=True, verbose_name='Изображение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    is_published = models.BooleanField(default=True, verbose_name='Опубликовано')

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='URL')
    description = models.TextField(blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    CURRENCY_CHOICES = [
        ('CP-COIN', 'CP-COIN'),
        ('RUB', 'RUB'),
        ('USD', 'USD'),
    ]

    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='CP-COIN', verbose_name='Валюта')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name='Категория')
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name='Изображение')
    is_available = models.BooleanField(default=True, verbose_name='Доступен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
