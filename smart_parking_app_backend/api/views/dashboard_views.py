from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from collections import Counter
from django.db.models import Count
from ..models import Reservation

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_summary(request):
    try:
        today = date.today()

        # Calculate start and end of the current week (Monday to Sunday)
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        # Total reservations today
        total_reservations_today = Reservation.objects.filter(date=today).count()
        # Total cancellations today
        total_cancellations_today = Reservation.objects.filter(date=today, is_cancelled=True).count()
        # Total reservations in current week
        total_reservations_this_week = Reservation.objects.filter(date__range=(start_of_week, end_of_week)).count()
        # Reservations pending approval and not cancelled
        pending_approvals = Reservation.objects.filter(is_approved=False, is_cancelled=False).count()
        # Vehicles currently parked (arrived but not exited)
        currently_parked = Reservation.objects.filter(has_arrived=True, has_exited=False).count()

        # Prepare 7-day daily reservation counts for line chart
        daily_counts = Reservation.objects.filter(
            date__gte=today - timedelta(days=6)
        ).values('date').annotate(count=Count('id'))
        daily_dict = {str(item['date']): item['count'] for item in daily_counts}
        daily_reservations = [
            {"date": str(today - timedelta(days=i)), "count": daily_dict.get(str(today - timedelta(days=i)), 0)}
            for i in reversed(range(7))
        ]

        # Count payment methods used
        payments = Reservation.objects.values_list('mode_of_payment', flat=True)
        payment_distribution = dict(Counter(payments))

        # Build approval funnel
        approval_funnel = {
            "pending": Reservation.objects.filter(is_approved=False, is_cancelled=False).count(),
            "approved_unpaid": Reservation.objects.filter(is_approved=True, is_paid=False, is_cancelled=False).count(),
            "approved_paid": Reservation.objects.filter(is_approved=True, is_paid=True, is_cancelled=False).count(),
            "cancelled": Reservation.objects.filter(is_cancelled=True).count(),
        }

        return Response({
            "total_reservations_today": total_reservations_today,
            "total_reservations_this_week": total_reservations_this_week,
            "total_cancellations_today": total_cancellations_today,
            "pending_approvals": pending_approvals,
            "currently_parked": currently_parked,
            "daily_reservations": daily_reservations,
            "payment_distribution": payment_distribution,
            "approval_funnel": approval_funnel,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
