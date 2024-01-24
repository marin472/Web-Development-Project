from django.shortcuts import render, redirect
from .forms import TicketForm

def submit_ticket(request):
    if request.method == "POST":
        form = TicketForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('submit_ticket_success')
    else:
        form = TicketForm()
    return render(request, 'tickets/submit_ticket.html', {'form': form})
