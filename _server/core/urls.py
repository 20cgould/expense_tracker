from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('delete/<int:id>/', views.delete),
    path('update', views.update),
    path('new_expense/', views.new_expense),
    path('new_budget/', views.new_budget),
    path('get_user/', views.get_user),
    path('get_expenses/', views.get_expenses),
    path('get_expense', views.get_expense),
    path('get_budget/', views.get_budget),
 
    
]