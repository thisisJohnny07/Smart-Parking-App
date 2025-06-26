from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from ..serializers.user_serializers import (
    DeactivateUserSerializer,
    ActivateUserSerializer,
    RegularUserSerializer,
    UserUpdateSerializer,
    UserProfileSerializer
)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def deactivate_user(request):
    try:
        serializer = DeactivateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Deactivate the user
            return Response({'message': f'User "{user.username}" has been deactivated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def activate_user(request):
    try:
        serializer = ActivateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Activate the user
            return Response({'message': f'User "{user.username}" has been activated.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def view_regular_users(request):
    try:
        # Fetch all users except superusers
        regular_users = User.objects.filter(is_superuser=False)
        serializer = RegularUserSerializer(regular_users, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_profile(request):
    try:
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response({
            "success": True,
            "message": "User profile fetched successfully",
            "data": serializer.data
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)