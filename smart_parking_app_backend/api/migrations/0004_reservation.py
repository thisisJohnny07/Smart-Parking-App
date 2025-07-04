# Generated by Django 5.2.3 on 2025-06-22 06:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_location_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.location')),
                ('slot_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.slottype')),
                ('vehicle_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.vehicletype')),
            ],
        ),
    ]
