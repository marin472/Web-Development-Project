from django.urls import path
from .views import get_leaderboard, update_score

urlpatterns = [
    path('api/leaderboard/', get_leaderboard, name='get_leaderboard'),
    path('api/update_score/', update_score, name='update_score'),
]
