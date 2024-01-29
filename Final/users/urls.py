from django.urls import path
from .api_views import register
from .api_views import login

urlpatterns = [
    path('api/register/', register, name='api_register'),path('api/login/', login, name='api_login'),
    # other patterns
]
