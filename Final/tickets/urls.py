from django.contrib import admin
from django.urls import include, path
from .api_views import list_tickets, add_ticket

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('django_app.users.urls')),
    path('tickets/', include('django_app.tickets.urls')),
    path('api/list/', list_tickets, name='api_list_tickets'),
    path('api/add/', add_ticket, name='api_add_ticket'),
    
]
