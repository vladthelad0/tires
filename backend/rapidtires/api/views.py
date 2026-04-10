from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import ServiceRequest, CallEvent
from .serializers import ServiceRequestCreateSerializer, ServiceRequestPublicSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')


def send_notification_email(service_request):
    issue_label = dict(ServiceRequest.ISSUE_CHOICES).get(service_request.issue_type, service_request.issue_type)
    coords = ''
    if service_request.latitude and service_request.longitude:
        coords = f"\nCoordinates: {service_request.latitude}, {service_request.longitude}"

    body = f"""New Service Request Received

Ticket Code: {service_request.ticket_code}
Name: {service_request.name}
Phone: {service_request.phone}
Address: {service_request.address}{coords}
Issue Type: {issue_label}
Tire Size: {service_request.tire_size or 'Not specified'}
Submitted: {service_request.created_at.strftime('%Y-%m-%d %H:%M:%S %Z')}
"""

    try:
        send_mail(
            subject=f"New Service Request - {issue_label} - {service_request.ticket_code}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.NOTIFY_EMAIL],
            fail_silently=False,
        )
        service_request.notified = True
        service_request.save(update_fields=['notified'])
    except Exception:
        pass


class ServiceRequestCreateView(APIView):
    def post(self, request):
        serializer = ServiceRequestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        service_request = serializer.save()

        if settings.NOTIFY_EMAIL:
            send_notification_email(service_request)

        return Response({
            'ticket_code': service_request.ticket_code,
            'id': str(service_request.id),
            'status': service_request.status,
        }, status=status.HTTP_201_CREATED)


class ServiceRequestDetailView(APIView):
    def get(self, request, ticket_code):
        try:
            service_request = ServiceRequest.objects.get(ticket_code=ticket_code.upper())
        except ServiceRequest.DoesNotExist:
            return Response({'detail': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceRequestPublicSerializer(service_request)
        return Response(serializer.data)


class TrackCallView(APIView):
    def post(self, request):
        CallEvent.objects.create(
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            ip_address=get_client_ip(request),
        )
        return Response({'success': True})
