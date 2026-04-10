import uuid
import random
import string
from django.db import models


def generate_ticket_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


class ServiceRequest(models.Model):
    ISSUE_CHOICES = [
        ('flat_repair', 'Flat Repair'),
        ('locked_out', 'Roadside - Locked Out'),
        ('no_fuel', 'Roadside - No Fuel'),
        ('jumpstart', 'Roadside - Battery Jumpstart'),
        ('tire_replacement', 'Tire Replacement / Installation'),
        ('emergency', 'Emergency'),
    ]

    STATUS_CHOICES = [
        ('received', 'Received'),
        ('assigned', 'Technician Assigned'),
        ('en_route', 'En Route'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_code = models.CharField(max_length=8, unique=True, blank=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=500)
    latitude = models.DecimalField(max_digits=999, decimal_places=20, null=True, blank=True)
    longitude = models.DecimalField(max_digits=999, decimal_places=20, null=True, blank=True)
    issue_type = models.CharField(max_length=50, choices=ISSUE_CHOICES)
    tire_size = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    status_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.ticket_code:
            code = generate_ticket_code()
            while ServiceRequest.objects.filter(ticket_code=code).exists():
                code = generate_ticket_code()
            self.ticket_code = code
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_code} - {self.name} ({self.status})"

    class Meta:
        ordering = ['-created_at']


class CallEvent(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.CharField(max_length=45, blank=True)

    def __str__(self):
        return f"Call event at {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
