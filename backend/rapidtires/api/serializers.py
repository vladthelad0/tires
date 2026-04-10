from rest_framework import serializers
from .models import ServiceRequest, CallEvent


class ServiceRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ['name', 'phone', 'address', 'latitude', 'longitude', 'issue_type', 'tire_size']


class ServiceRequestPublicSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.name.split()[0] if obj.name else ''

    class Meta:
        model = ServiceRequest
        fields = ['ticket_code', 'name', 'status', 'status_note', 'issue_type', 'created_at', 'updated_at']
