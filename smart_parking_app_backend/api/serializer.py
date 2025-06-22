from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Location, SlotType, VehicleType, SlotPricing, Reservation

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'is_active', 'is_superuser', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
            'date_joined': {'read_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        # Set the extra fields explicitly
        user.is_active = True
        user.is_superuser = False
        user.date_joined = timezone.now()
        user.save()
        return user

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class SlotTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotType
        fields = '__all__'

class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = '__all__'

class SlotPricingSerializer(serializers.ModelSerializer):
    slot_type_id = serializers.PrimaryKeyRelatedField(queryset=SlotType.objects.all())
    vehicle_type_id = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all())

    class Meta:
        model = SlotPricing
        fields = ['slot_type_id', 'vehicle_type_id', 'rate_per_hour', 'available_slots']

class LocationCreateSerializer(serializers.ModelSerializer):
    slot_pricings = SlotPricingSerializer(many=True, write_only=True)

    class Meta:
        model = Location
        fields = ['name', 'address', 'slot_pricings']

    def create(self, validated_data):
        slot_pricings_data = validated_data.pop('slot_pricings')
        location = Location.objects.create(**validated_data)
        for sp_data in slot_pricings_data:
            SlotPricing.objects.create(location_id=location, **sp_data)
        return location

    def update(self, instance, validated_data):
        slot_pricings_data = validated_data.pop('slot_pricings', None)
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.save()

        if slot_pricings_data is not None:
            # Remove old pricings and add new ones
            instance.slot_pricings.all().delete()
            for sp_data in slot_pricings_data:
                SlotPricing.objects.create(location_id=instance, **sp_data)

        return instance

class SlotAvailabilitySearchSerializer(serializers.Serializer):
    location_id = serializers.IntegerField()
    vehicle_type_id = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField()

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user']