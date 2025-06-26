from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from ..serializers.reservation_serializers import (
    CreateReservationSerializer,
    ReservationSerializer,
    AdminCancelReservationSerializer,
    ReservationCheckSerializer,
    ReservationAdminSerializer
)
from ..models import Reservation, Notification

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    serializer = CreateReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # Link reservation to current user
        return Response({"message": "Reservation created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reservations(request):
    try:
        user = request.user
        reservations = Reservation.objects.filter(user=user).order_by('-date', '-time')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id, user=request.user)
        if reservation.is_cancelled:
            return Response({"message": "Reservation already cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        reservation.is_cancelled = True
        reservation.save()

        return Response({"message": "Reservation cancelled successfully"}, status=status.HTTP_200_OK)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found or not yours"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def mark_reservation_as_paid(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        reservation.is_paid = True
        reservation.save()
        return Response({"message": f"Reservation {reservation_id} marked as paid."}, status=status.HTTP_200_OK)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_cancel_reservation(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AdminCancelReservationSerializer(reservation, data={'is_cancelled': True}, partial=True)

    if serializer.is_valid():
        serializer.save()

        # Build appropriate refund/cancellation message
        refund_methods = ['GCash', 'Maya', 'Card']
        if reservation.mode_of_payment in refund_methods:
            message = (
                f"Your reservation on {reservation.date} at {reservation.location.name} "
                f"has been cancelled. A refund will be processed shortly."
            )
        elif reservation.mode_of_payment == 'Cash':
            if reservation.is_paid:
                message = (
                    f"Your reservation on {reservation.date} at {reservation.location.name} "
                    f"has been cancelled. Please contact the administrator for a refund."
                )
            else:
                message = (
                    f"Your reservation on {reservation.date} at {reservation.location.name} "
                    f"has been cancelled."
                )
        else:
            message = (
                f"Your reservation on {reservation.date} at {reservation.location.name} "
                f"has been cancelled."
            )

        # Notify the user
        Notification.objects.create(
            user=reservation.user,
            reservation=reservation,
            message=message
        )

        return Response({
            "message": "Reservation cancelled successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def mark_check_in(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        serializer = ReservationCheckSerializer(reservation, data={"has_arrived": True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Check-in marked successfully", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def mark_check_out(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        serializer = ReservationCheckSerializer(reservation, data={"has_exited": True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Check-out marked successfully", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_reservations(request):
    try:
        # Fetch all reservations with related data for admin viewing
        reservations = Reservation.objects.select_related('location', 'slot_type', 'vehicle_type', 'user').all()
        serializer = ReservationAdminSerializer(reservations, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def approve_reservation(request, reservation_id):
    try:
        reservation = Reservation.objects.get(pk=reservation_id)
        reservation.is_approved = True
        reservation.save()
        return Response({'message': 'Reservation approved successfully'})
    except Reservation.DoesNotExist:
        return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)