from rest_framework import serializers
from django.contrib.auth.models import User

# Serializer for basic user info (id, username, email, first and last name)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# Serializer for updating user's first name, last name, and username
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username']

# Serializer for user profile display including computed full name
class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['full_name', 'email', 'username']

    def get_full_name(self, obj):
        # Compose full name from first and last name
        return f"{obj.first_name} {obj.last_name}".strip()

# Serializer for regular users with extended info including is_active and date_joined
class RegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']

# Serializer to deactivate a user by user_id; disallows deactivating superusers
class DeactivateUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        from django.contrib.auth.models import User
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

# Serializer to activate a user by user_id; disallows activating superusers
class ActivateUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        from django.contrib.auth.models import User
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