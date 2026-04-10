from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from .models import ServiceRequest, CallEvent


def clear_completed_cancelled(modeladmin, request, queryset):
    deleted_count, _ = ServiceRequest.objects.filter(status__in=['completed', 'cancelled']).delete()
    modeladmin.message_user(request, f"Deleted {deleted_count} completed/cancelled tickets.", messages.SUCCESS)
clear_completed_cancelled.short_description = "Clear completed & cancelled tickets"


def clear_all_tickets(modeladmin, request, queryset):
    if request.POST.get('confirm_clear_all') == 'yes':
        deleted_count, _ = ServiceRequest.objects.all().delete()
        modeladmin.message_user(request, f"Deleted ALL {deleted_count} tickets.", messages.WARNING)
    else:
        modeladmin.message_user(
            request,
            "To confirm deletion of ALL tickets, use the Django shell or re-run with confirmation.",
            messages.WARNING
        )
clear_all_tickets.short_description = "⚠️ Clear ALL tickets (end-of-day wipe)"


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_code', 'name', 'phone', 'issue_type',
        'status', 'maps_link', 'created_at',
    ]
    list_filter = ['status', 'issue_type']
    search_fields = ['ticket_code', 'name', 'phone', 'address']
    readonly_fields = ['id', 'ticket_code', 'created_at', 'updated_at', 'notified', 'maps_link']
    fields = [
        'id', 'ticket_code', 'name', 'phone', 'address',
        'latitude', 'longitude', 'maps_link', 'issue_type', 'tire_size',
        'status', 'status_note', 'created_at', 'updated_at', 'notified',
    ]
    actions = [clear_completed_cancelled, clear_all_tickets]

    @admin.display(description='Open in Maps')
    def maps_link(self, obj):
        if obj.latitude and obj.longitude:
            url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer" '
                'style="background:#fed400;color:#111;padding:3px 10px;border-radius:4px;'
                'font-weight:bold;text-decoration:none;white-space:nowrap;">📍 Navigate</a>',
                url
            )
        return format_html('<span style="color:#999">No pin</span>')


@admin.register(CallEvent)
class CallEventAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'ip_address', 'user_agent']
    readonly_fields = ['timestamp', 'user_agent', 'ip_address']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
