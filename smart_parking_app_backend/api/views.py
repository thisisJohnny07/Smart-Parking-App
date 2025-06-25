import base64
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializer import ActivateUserSerializer, AdminCancelReservationSerializer, ChangePasswordSerializer, CheckoutSessionSerializer, CreateReservationSerializer, DeactivateUserSerializer, LocationDetailSerializer, MyTokenObtainPairSerializer, NotificationSerializer, RegisterSerializer, LocationCreateSerializer, RegularUserSerializer, ReservationAdminSerializer, ReservationCheckSerializer, SlotAvailabilitySearchSerializer, ReservationSerializer, UserProfileSerializer, UserUpdateSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from .models import Location, Notification, Reservation, SlotPricing, VehicleType
from django.db.models import Count
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView

import os
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import date, timedelta
from collections import Counter
from django.db.models import Count


secret_key = os.getenv('PAYMONGO_SECRET_KEY')
encoded_key = base64.b64encode(secret_key.encode()).decode()
headers = {
    'Authorization': f'Basic {encoded_key}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_location_with_pricings(request):
    serializer = LocationCreateSerializer(data=request.data)
    try:
        with transaction.atomic():
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response({"message": "Location and slot pricings created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def location_list_with_slot_details(request):
    locations = Location.objects.prefetch_related('slot_pricings__slot_type_id', 'slot_pricings__vehicle_type_id')
    serializer = LocationDetailSerializer(locations, many=True)
    return Response(serializer.data)
    
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_location_with_pricings(request, location_id):
    try:
        location = Location.objects.get(id=location_id)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = LocationCreateSerializer(location, data=request.data)
    try:
        with transaction.atomic():
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response({"message": "Location and slot pricings updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_location(request, location_id):
    try:
        location = Location.objects.get(id=location_id)
        location.delete()
        return Response({"message": "Location deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)


from datetime import timedelta, datetime
from django.utils.dateparse import parse_time

@api_view(['POST'])
@permission_classes([AllowAny])
def check_slot_availability(request):
    serializer = SlotAvailabilitySearchSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    location_id = data['location_id']
    vehicle_type_id = data['vehicle_type_id']
    date = data['date']
    time = data['time']
    
    # Convert searched time to datetime
    search_start = datetime.combine(date, time)
    search_end = search_start + timedelta(hours=1)

    # Get all slot pricing rows for this location and vehicle type
    slot_pricings = SlotPricing.objects.filter(
        location_id=location_id,
        vehicle_type_id=vehicle_type_id
    )

    # Get overlapping reservations for that location, vehicle type, and date
    reservations = Reservation.objects.filter(
        location_id=location_id,
        vehicle_type_id=vehicle_type_id,
        date=date,
        is_cancelled=False
    )

    overlapping_counts = {}

    for res in reservations:
        res_start = datetime.combine(res.date, res.time)
        res_end = res_start + timedelta(hours=res.duration_hours)

        # Check if there's an overlap
        if res_start < search_end and search_start < res_end:
            key = res.slot_type.id
            overlapping_counts[key] = overlapping_counts.get(key, 0) + 1

    # Prepare results
    results = []
    for pricing in slot_pricings:
        reserved = overlapping_counts.get(pricing.slot_type_id.id, 0)
        available = pricing.available_slots - reserved
        results.append({
            'slot_type': pricing.slot_type_id.name,
            'rate_per_hour': pricing.rate_per_hour,
            'available_slots': max(available, 0),
            'description': pricing.slot_type_id.description,
            'type': pricing.slot_type_id.type,
        })

    return Response({'results': results}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    serializer = CreateReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({"message": "Reservation created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reservations(request):
    user = request.user
    reservations = Reservation.objects.filter(user=user).order_by('-date', '-time')
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id, user=request.user)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found or not yours"}, status=status.HTTP_404_NOT_FOUND)

    if reservation.is_cancelled:
        return Response({"message": "Reservation already cancelled"}, status=status.HTTP_400_BAD_REQUEST)

    reservation.is_cancelled = True
    reservation.save()

    return Response({"message": "Reservation cancelled successfully"}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def mark_reservation_as_paid(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)

    reservation.is_paid = True
    reservation.save()

    return Response({"message": f"Reservation {reservation_id} marked as paid."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def deactivate_user(request):
    serializer = DeactivateUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': f'User "{user.username}" has been deactivated.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def activate_user(request):
    serializer = ActivateUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': f'User "{user.username}" has been activated.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def view_regular_users(request):
    regular_users = User.objects.filter(is_superuser=False)
    serializer = RegularUserSerializer(regular_users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_reservations(request):
    reservations = Reservation.objects.select_related('location', 'slot_type', 'vehicle_type', 'user').all()
    serializer = ReservationAdminSerializer(reservations, many=True)
    return Response(serializer.data)

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

        # Determine the appropriate message
        refund_methods = ['GCash', 'Maya', 'Card']

        if reservation.mode_of_payment in refund_methods:
            # Online payment refund message
            message = (
                f"Your reservation on {reservation.date} at {reservation.location.name} "
                f"has been cancelled. A refund will be processed shortly."
            )
        elif reservation.mode_of_payment == 'Cash':
            if reservation.is_paid:
                # Cash and already paid
                message = (
                    f"Your reservation on {reservation.date} at {reservation.location.name} "
                    f"has been cancelled. Please contact the administrator for a refund."
                )
            else:
                # Cash but not paid
                message = (
                    f"Your reservation on {reservation.date} at {reservation.location.name} "
                    f"has been cancelled."
                )
        else:
            # Fallback generic message
            message = (
                f"Your reservation on {reservation.date} at {reservation.location.name} "
                f"has been cancelled."
            )

        # Create notification
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
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReservationCheckSerializer(reservation, data={"has_arrived": True}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Check-in marked successfully", "data": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def mark_check_out(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ReservationCheckSerializer(reservation, data={"has_exited": True}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Check-out marked successfully", "data": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def locations_and_vehicle_types(request):
    locations = Location.objects.all().values('id', 'address')
    vehicle_types = VehicleType.objects.all().values('id', 'name')

    return Response({
        'locations': list(locations),
        'vehicle_types': list(vehicle_types),
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):

    # Validate input
    serializer = CheckoutSessionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'message': 'Invalid input', 'errors': serializer.errors}, status=400)
    validated = serializer.validated_data

    # Authenticated user info
    user = request.user
    billing_name = user.get_full_name() or user.username
    billing_email = user.email

    # Prepare auth header
    secret_key = os.getenv('PAYMONGO_SECRET_KEY')
    if not secret_key:
        return Response({'error': 'PayMongo secret key missing'}, status=500)
    encoded_key = base64.b64encode(secret_key.encode()).decode()
    headers = {
        'Authorization': f'Basic {encoded_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    # Prepare payload
    amount_in_centavos = int(validated['line_item_amount'] * 100)
    payload = {
        "data": {
            "attributes": {
                "billing": {
                    "name": billing_name,
                    "email": billing_email,
                    "phone": validated['billing_phone']
                },
                "send_email_receipt": False,
                "show_description": True,
                "show_line_items": True,
                "description": validated['description'],
                "line_items": [
                    {
                        "currency": validated['currency'],
                        "amount": amount_in_centavos,
                        "name": validated['line_item_name'],
                        "quantity": validated['line_item_quantity']
                    }
                ],
                "payment_method_types": [validated['payment_method']],
                "cancel_url": "http://localhost:5173/step-payment?payment=cancel",
                "success_url": "http://localhost:5173/payment-callback",  # update this
                "reference_number": "REF123456"  # can use dynamic logic
            }
        }
    }

    # Send request to PayMongo
    resp = requests.post('https://api.paymongo.com/v1/checkout_sessions', headers=headers, json=payload)
    if resp.status_code in (200, 201):
        response_data = resp.json().get('data', {})
        return Response({
            "success": True,
            "message": "Success",
            "data": {
                "id": response_data.get("id"),
                "type": response_data.get("type"),
                "checkout_url": response_data.get("attributes", {}).get("checkout_url")
            }
        }, status=201)
    else:
        return Response({'success': False, 'message': 'PayMongo error', 'details': resp.json()}, status=resp.status_code)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response({
        "success": True,
        "message": "User profile fetched successfully",
        "data": serializer.data
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"success": True, "message": "Password updated successfully."}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    user = request.user
    updated_count = Notification.objects.filter(user=user, is_read=False).update(is_read=True)
    return Response({
        "success": True,
        "message": f"{updated_count} notifications marked as read."
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def count_unread_notifications(request):
    user = request.user
    unread_count = Notification.objects.filter(user=user, is_read=False).count()
    return Response({
        "success": True,
        "unread_count": unread_count
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_unread_notifications(request):
    user = request.user
    unread_notifications = Notification.objects.filter(user=user, is_read=False).order_by('-created_at')
    serializer = NotificationSerializer(unread_notifications, many=True)
    return Response({
        "success": True,
        "message": "Unread notifications fetched successfully",
        "data": serializer.data
    })

@api_view(['DELETE'])
@permission_classes([AllowAny])  # Protect this!
def delete_all_reservations(request):
    Reservation.objects.all().delete()
    return Response({"message": "All reservations deleted successfully."}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def approve_reservation(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return Response({"detail": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)

    # Force is_approved = True on approval
    reservation.is_approved = True
    reservation.save()

    return Response({"detail": "Reservation approved.", "is_approved": reservation.is_approved}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_summary(request):
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    # Summary counts
    total_reservations_today = Reservation.objects.filter(date=today).count()
    total_reservations_this_week = Reservation.objects.filter(date__range=(start_of_week, end_of_week)).count()
    total_cancellations_today = Reservation.objects.filter(date=today, is_cancelled=True).count()
    pending_approvals = Reservation.objects.filter(is_approved=False, is_cancelled=False).count()
    currently_parked = Reservation.objects.filter(has_arrived=True, has_exited=False).count()

    # Daily reservation counts (last 7 days)
    daily_counts = Reservation.objects.filter(
        date__gte=today - timedelta(days=6)
    ).values('date').annotate(count=Count('id'))

    daily_dict = {str(item['date']): item['count'] for item in daily_counts}
    daily_reservations = [
        {"date": str(today - timedelta(days=i)), "count": daily_dict.get(str(today - timedelta(days=i)), 0)}
        for i in reversed(range(7))
    ]

    # Payment mode distribution
    payments = Reservation.objects.values_list('mode_of_payment', flat=True)
    payment_distribution = dict(Counter(payments))

    # Approval funnel
    approval_funnel = {
        "pending": Reservation.objects.filter(is_approved=False, is_cancelled=False).count(),
        "approved_unpaid": Reservation.objects.filter(is_approved=True, is_paid=False, is_cancelled=False).count(),
        "approved_paid": Reservation.objects.filter(is_approved=True, is_paid=True, is_cancelled=False).count(),
        "cancelled": Reservation.objects.filter(is_cancelled=True).count(),
    }

    return Response({
        "summary": {
            "total_reservations_today": total_reservations_today,
            "total_reservations_this_week": total_reservations_this_week,
            "total_cancellations_today": total_cancellations_today,
            "pending_approvals": pending_approvals,
            "currently_parked": currently_parked
        },
        "daily_reservations": daily_reservations,
        "payment_distribution": payment_distribution,
        "approval_funnel": approval_funnel
    })