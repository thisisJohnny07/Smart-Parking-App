from rest_framework import serializers
from ..models import Location, SlotPricing, SlotType, VehicleType

# Serializer for creating/updating slot pricing entries
class SlotPricingSerializer(serializers.ModelSerializer):
    slot_type_id = serializers.PrimaryKeyRelatedField(queryset=SlotType.objects.all())     # FK to SlotType
    vehicle_type_id = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all())  # FK to VehicleType

    class Meta:
        model = SlotPricing
        fields = ['slot_type_id', 'vehicle_type_id', 'rate_per_hour', 'available_slots']

# Serializer used when creating or updating a location with nested slot pricings
class LocationCreateSerializer(serializers.ModelSerializer):
    slot_pricings = SlotPricingSerializer(many=True, write_only=True)  # Nested pricing data, only for input

    class Meta:
        model = Location
        fields = ['name', 'address', 'slot_pricings']

    def create(self, validated_data):
        # Extract nested pricing data and remove from main payload
        slot_pricings_data = validated_data.pop('slot_pricings')
        # Create the Location instance
        location = Location.objects.create(**validated_data)
        # Create each SlotPricing associated with the new location
        for sp_data in slot_pricings_data:
            SlotPricing.objects.create(location_id=location, **sp_data)
        return location

    def update(self, instance, validated_data):
        # Update Location fields
        slot_pricings_data = validated_data.pop('slot_pricings', None)
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.save()

        if slot_pricings_data is not None:
            # Delete all existing slot pricings for this location
            instance.slot_pricings.all().delete()
            # Recreate new slot pricing records
            for sp_data in slot_pricings_data:
                SlotPricing.objects.create(location_id=instance, **sp_data)
        return instance

# Read-only serializer that returns descriptive slot and vehicle type names
class SlotPricingDetailSerializer(serializers.ModelSerializer):
    slot_type = serializers.CharField(source='slot_type_id.name')             # SlotType name
    slot_description = serializers.CharField(source='slot_type_id.description')  # SlotType description
    vehicle_type = serializers.CharField(source='vehicle_type_id.name')       # VehicleType name

    class Meta:
        model = SlotPricing
        fields = ['slot_type', 'slot_description', 'vehicle_type', 'rate_per_hour', 'available_slots']

# Serializer for viewing location along with slot pricing details
class LocationDetailSerializer(serializers.ModelSerializer):
    slot_pricings = SlotPricingDetailSerializer(many=True, read_only=True)  # Use nested detail serializer

    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'slot_pricings']

# Simple serializer for listing or selecting locations
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address']

# Serializer for searching available slots given parameters
class SlotAvailabilitySearchSerializer(serializers.Serializer):
    location_id = serializers.IntegerField()
    vehicle_type_id = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField()

# Serializer for vehicle type listing
class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = ['id', 'name']

# Serializer for slot type listing
class SlotTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotType
        fields = ['id', 'name', 'description', 'type']