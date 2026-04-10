from django.urls import path
from .views import ServiceRequestCreateView, ServiceRequestDetailView, TrackCallView

urlpatterns = [
    path('service-request/', ServiceRequestCreateView.as_view(), name='service-request-create'),
    path('service-request/<str:ticket_code>/', ServiceRequestDetailView.as_view(), name='service-request-detail'),
    path('track/call/', TrackCallView.as_view(), name='track-call'),
]
