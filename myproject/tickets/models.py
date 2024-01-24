from django.db import models

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    
    title = models.CharField(max_length=100)
    description = models.TextField()
    submitted_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=6, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return self.title
    



