from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from ..serializers.location_serializers import (
    LocationCreateSerializer,
    LocationDetailSerializer,
    SlotAvailabilitySearchSerializer,
    LocationSerializer,
    VehicleTypeSerializer
)
from ..models import Location, SlotPricing, Reservation, VehicleType
from datetime import datetime, timedelta

@api_view(['POST'])
@permission_classes([AllowAny])
def create_location_with_pricings(request):
    serializer = LocationCreateSerializer(data=request.data)
    try:
        # Atomic block to ensure full creation or rollback on failure
        with transaction.atomic():
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response({"message": "Location and slot pricings created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def location_list_with_slot_details(request):
    try:
        # Prefetch related fields to reduce query count
        locations = Location.objects.prefetch_related(
            'slot_pricings__slot_type_id',
            'slot_pricings__vehicle_type_id'
        )
        serializer = LocationDetailSerializer(locations, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_slot_availability(request):
    serializer = SlotAvailabilitySearchSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        data = serializer.validated_data
        location_id = data['location_id']
        vehicle_type_id = data['vehicle_type_id']
        date = data['date']
        time = data['time']

        # Calculate time range for 1-hour slot
        search_start = datetime.combine(date, time)
        search_end = search_start + timedelta(hours=1)

        # Fetch relevant pricing and reservations
        slot_pricings = SlotPricing.objects.filter(
            location_id=location_id,
            vehicle_type_id=vehicle_type_id
        )
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

            # Check for time overlap
            if res_start < search_end and search_start < res_end:
                key = res.slot_type.id
                overlapping_counts[key] = overlapping_counts.get(key, 0) + 1

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
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def locations_and_vehicle_types(request):
    try:
        # Fetch all locations and vehicle types
        locations = Location.objects.all()
        vehicles = VehicleType.objects.all()

        location_data = LocationSerializer(locations, many=True).data
        vehicle_data = VehicleTypeSerializer(vehicles, many=True).data

        return Response({
            'locations': location_data,
            'vehicle_types': vehicle_data,
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)