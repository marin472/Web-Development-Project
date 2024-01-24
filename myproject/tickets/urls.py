from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_ticket, name='submit_ticket'),
    # Add more URL configurations here
]
