from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('delete/<int:id>/', views.delete_city, name="delete_city"),
    path('city/<int:id>/', views.city_detail, name="city_detail"),
]