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

    # maps_link must only appear in readonly_fields, NOT in fields — adding a
    # callable to both causes a Django 5.x admin rendering conflict.
    # latitude/longitude are readonly so operators can't accidentally corrupt coords.
    readonly_fields = [
        'id', 'ticket_code', 'maps_link',
        'latitude', 'longitude',
        'created_at', 'updated_at', 'notified',
    ]
    fields = [
        'id', 'ticket_code',
        'name', 'phone', 'address',
        'latitude', 'longitude', 'maps_link',
        'issue_type', 'tire_size',
        'status', 'status_note',
        'created_at', 'updated_at', 'notified',
    ]
    actions = [clear_completed_cancelled, clear_all_tickets]

    @admin.display(description='📍 Navigate')
    def maps_link(self, obj):
        if obj.latitude and obj.longitude:
            url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer" '
                'style="background:#fed400;color:#111111;padding:4px 12px;'
                'border-radius:4px;font-weight:bold;text-decoration:none;'
                'white-space:nowrap;display:inline-block;">📍 Open in Maps</a>',
                url,
            )
        return '—'


@admin.register(CallEvent)
class CallEventAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'ip_address', 'user_agent']
    readonly_fields = ['timestamp', 'user_agent', 'ip_address']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
