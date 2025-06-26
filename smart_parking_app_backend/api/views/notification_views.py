from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import Notification
from ..serializers.notification_serializers import NotificationSerializer

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    try:
        user = request.user
        # Update all unread notifications for the user
        updated_count = Notification.objects.filter(user=user, is_read=False).update(is_read=True)
        return Response({
            "success": True,
            "message": f"{updated_count} notifications marked as read."
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_unread_notifications(request):
    try:
        user = request.user
        unread_count = Notification.objects.filter(user=user, is_read=False).count()
        return Response({
            "success": True,
            "unread_count": unread_count
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_unread_notifications(request):
    try:
        user = request.user
        # Fetch unread notifications sorted by creation time
        unread_notifications = Notification.objects.filter(
            user=user, is_read=False
        ).order_by('-created_at')
        serializer = NotificationSerializer(unread_notifications, many=True)
        return Response({
            "success": True,
            "message": "Unread notifications fetched successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)