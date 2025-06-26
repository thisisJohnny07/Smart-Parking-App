from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Location Model
class Location(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return f"{self.name} - {self.address}"

#Slot Type Model
class SlotType(models.Model):
    SLOT_CHOICES = [
        ('standard', 'Standard'),
        ('covered', 'Covered'),
        ('premium', 'Premium'),
    ]
    name = models.CharField(max_length=20, choices=SLOT_CHOICES)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.get_name_display()


class VehicleType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

#Slot Pricing Model
class SlotPricing(models.Model):
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='slot_pricings')
    slot_type_id = models.ForeignKey(SlotType, on_delete=models.CASCADE)
    vehicle_type_id = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    rate_per_hour = models.DecimalField(max_digits=6, decimal_places=2)
    available_slots = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.location_id} - {self.slot_type_id} - {self.vehicle_type_id}"

# Reservation Model
class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    slot_type = models.ForeignKey(SlotType, on_delete=models.CASCADE)
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    duration_hours = models.PositiveIntegerField(default=1)

    # Vehicle details
    plate_number = models.CharField(max_length=20)
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    color = models.CharField(max_length=30)

    # Payment
    mode_of_payment = models.CharField(max_length=50)  # e.g. "cash", "gcash", etc.
    is_paid = models.BooleanField(default=False)

    is_cancelled = models.BooleanField(default=False)
    has_arrived = models.BooleanField(default=False)
    has_exited = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.location.name} - {self.slot_type.name} - {self.vehicle_type.name} - {self.date} {self.time} - Plate: {self.plate_number}"

# Notifications Model
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - Read: {self.is_read}"