from rest_framework import serializers
from ..models import Reservation, Location, SlotType, VehicleType
from .user_serializers import UserSerializer
from .location_serializers import LocationSerializer, SlotTypeSerializer, VehicleTypeSerializer

# Serializer for detailed reservation view with nested related objects (read-only)
class ReservationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    slot_type = SlotTypeSerializer(read_only=True)
    vehicle_type = VehicleTypeSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user']

# Serializer for creating/updating reservations, expects primary keys for related objects
class CreateReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    slot_type = serializers.PrimaryKeyRelatedField(queryset=SlotType.objects.all())
    vehicle_type = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all())

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user']

# Serializer for admin views showing related objects as string representations
class ReservationAdminSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    location = serializers.StringRelatedField()
    slot_type = serializers.StringRelatedField()
    vehicle_type = serializers.StringRelatedField()

    class Meta:
        model = Reservation
        fields = '__all__'

# Serializer for updating arrival and exit status only
class ReservationCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['has_arrived', 'has_exited']

# Serializer for admin to cancel reservation (update is_cancelled field)
class AdminCancelReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['is_cancelled']

    def update(self, instance, validated_data):
        instance.is_cancelled = validated_data.get('is_cancelled', instance.is_cancelled)
        instance.save()
        return instance