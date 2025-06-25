from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.validators import UniqueValidator
from .models import Location, Notification, SlotType, VehicleType, SlotPricing, Reservation
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra responses here
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'is_superuser': self.user.is_superuser,
            'is_staff': self.user.is_staff,
            # add other fields you need
        }

        return data

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already registered.")]
    )
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
    
class SlotPricingDetailSerializer(serializers.ModelSerializer):
    slot_type = serializers.CharField(source='slot_type_id.name')
    slot_description = serializers.CharField(source='slot_type_id.description')
    vehicle_type = serializers.CharField(source='vehicle_type_id.name')

    class Meta:
        model = SlotPricing
        fields = ['slot_type', 'slot_description', 'vehicle_type', 'rate_per_hour', 'available_slots']

class LocationDetailSerializer(serializers.ModelSerializer):
    slot_pricings = SlotPricingDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'slot_pricings']

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address']

class SlotTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotType
        fields = ['id', 'name', 'description', 'type']

class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = ['id', 'name']

class ReservationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    slot_type = SlotTypeSerializer(read_only=True)
    vehicle_type = VehicleTypeSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user']

class CreateReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    slot_type = serializers.PrimaryKeyRelatedField(queryset=SlotType.objects.all())
    vehicle_type = serializers.PrimaryKeyRelatedField(queryset=VehicleType.objects.all())

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['user']

class ReservationAdminSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    location = serializers.StringRelatedField()
    slot_type = serializers.StringRelatedField()
    vehicle_type = serializers.StringRelatedField()

    class Meta:
        model = Reservation
        fields = '__all__'

class ReservationCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['has_arrived', 'has_exited']

class AdminCancelReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['is_cancelled']

    def update(self, instance, validated_data):
        instance.is_cancelled = validated_data.get('is_cancelled', instance.is_cancelled)
        instance.save()
        return instance

class DeactivateUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if user.is_superuser:
            raise serializers.ValidationError("Cannot deactivate a superuser.")

        return value

    def save(self):
        user = User.objects.get(pk=self.validated_data['user_id'])
        user.is_active = False
        user.save()
        return user
    
class ActivateUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if user.is_superuser:
            raise serializers.ValidationError("Cannot activate a superuser.")

        return value

    def save(self):
        user = User.objects.get(pk=self.validated_data['user_id'])
        user.is_active = True
        user.save()
        return user
    
class RegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']

class CheckoutSessionSerializer(serializers.Serializer):
    description = serializers.CharField()
    billing_phone = serializers.CharField()
    line_item_amount = serializers.FloatField()
    line_item_name = serializers.CharField()
    line_item_quantity = serializers.IntegerField()
    currency = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=['card', 'gcash', 'paymaya'])

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username']

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['full_name', 'email', 'username']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
class NotificationSerializer(serializers.ModelSerializer):
    reservation_time = serializers.SerializerMethodField()
    reservation_date = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at', 'reservation_time', 'reservation_date', 'location']

    def get_reservation_time(self, obj):
        return obj.reservation.time if obj.reservation else None

    def get_reservation_date(self, obj):
        return obj.reservation.date if obj.reservation else None

    def get_location(self, obj):
        return obj.reservation.location.name if obj.reservation and obj.reservation.location else None