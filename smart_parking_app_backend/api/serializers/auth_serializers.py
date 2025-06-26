from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Custom JWT token serializer to include user info in response
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)  # Call parent validate method
        # Append user info to token response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'is_superuser': self.user.is_superuser,
            'is_staff': self.user.is_staff,
        }
        return data

# Serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    # Ensure unique username
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )
    # Ensure unique email
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already registered.")]
    )
    # Optional fields
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        # Include necessary fields
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'is_active', 'is_superuser', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},         # Don't return password in response
            'is_active': {'read_only': True},         # Read-only for API
            'is_superuser': {'read_only': True},      # Prevent assignment via API
            'date_joined': {'read_only': True},       # Set automatically
        }

    def create(self, validated_data):
        # Create user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.is_active = True                        # Activate user by default
        user.is_superuser = False                    # Ensure regular user
        user.date_joined = timezone.now()            # Set current time as join date
        user.save()
        return user

# Serializer for changing password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)   # User's current password
    new_password = serializers.CharField(required=True)   # New desired password

    def validate_old_password(self, value):
        user = self.context['request'].user                # Get current user from context
        # Check if entered old password is correct
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value