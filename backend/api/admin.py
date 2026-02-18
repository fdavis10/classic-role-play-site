from django.contrib import admin
from .models import News, Category, Product


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'is_published', 'created_at')
    list_filter = ('is_published', 'date')
    search_fields = ('title', 'description')
    date_hierarchy = 'date'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'currency', 'is_available', 'created_at')
    list_filter = ('category', 'currency', 'is_available')
    search_fields = ('name', 'description')
    prepopulated_fields = {}
