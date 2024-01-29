from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket

@api_view(['GET'])
def list_tickets(request):
    tickets = Ticket.objects.all().values()
    return Response({"tickets": list(tickets)})
@api_view(['POST'])
def add_ticket(request):
    title = request.data.get('title')
    description = request.data.get('description')
    user = request.user  # Assuming the user is already authenticated
    if not title or not description:
        return Response({"error": "Title and description required"}, status=400)

    Ticket.objects.create(title=title, description=description, user=user)
    return Response({"success": "Ticket created successfully"})
