from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Creates the default admin superuser if it does not already exist.'

    def handle(self, *args, **kwargs):
        username = 'admin'
        password = 'admin21'

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'Admin user "{username}" already exists — skipping.'))
        else:
            User.objects.create_superuser(username=username, password=password, email='')
            self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" created successfully.'))
