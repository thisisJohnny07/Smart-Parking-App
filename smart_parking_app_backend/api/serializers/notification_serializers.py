from rest_framework import serializers
from ..models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    reservation_time = serializers.SerializerMethodField()
    reservation_date = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at', 'reservation_time', 'reservation_date', 'location']

    def get_reservation_time(self, obj):
        # Return the time of the associated reservation, if any
        return obj.reservation.time if obj.reservation else None

    def get_reservation_date(self, obj):
        # Return the date of the associated reservation, if any
        return obj.reservation.date if obj.reservation else None

    def get_location(self, obj):
        # Return the location name of the associated reservation, if any
        return obj.reservation.location.name if obj.reservation and obj.reservation.location else None