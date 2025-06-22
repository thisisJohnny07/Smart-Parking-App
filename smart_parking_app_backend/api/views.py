from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializer import RegisterSerializer, LocationCreateSerializer, SlotAvailabilitySearchSerializer, ReservationSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from .models import Location, Reservation, Location, SlotPricing, VehicleType, SlotType
from django.db.models import Count

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

    # Get all slot pricing rows for this location and vehicle type
    slot_pricings = SlotPricing.objects.filter(
        location_id=location_id,
        vehicle_type_id=vehicle_type_id
    )

    # Count how many reservations exist per slot type for that datetime
    reserved_counts = Reservation.objects.filter(
        location_id=location_id,
        vehicle_type_id=vehicle_type_id,
        date=date,
        time=time
    ).values('slot_type_id').annotate(reserved_count=Count('id'))

    reserved_dict = {entry['slot_type_id']: entry['reserved_count'] for entry in reserved_counts}

    # Prepare results
    results = []
    for pricing in slot_pricings:
        reserved = reserved_dict.get(pricing.slot_type_id.id, 0)
        available = pricing.available_slots - reserved
        results.append({
            'slot_type': pricing.slot_type_id.name,
            'rate_per_hour': pricing.rate_per_hour,
            'available_slots': max(available, 0)
        })

    return Response({'results': results}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    serializer = ReservationSerializer(data=request.data)
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