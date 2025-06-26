from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Reservation, Location, SlotType, VehicleType

class ApproveReservationTest(APITestCase):
    def setUp(self):
        # Create admin user and login
        self.admin_user = User.objects.create_user(
            username='admin', password='adminpass', is_staff=True, is_superuser=True
        )
        self.client.login(username='admin', password='adminpass')

        # Create normal user
        self.normal_user = User.objects.create_user(
            username='testuser',
            password='testpass',
            email='testuser@example.com'
        )

        # Create related foreign key objects needed for Reservation
        self.location = Location.objects.create(
            name='Main Parking Lot',
            address='123 Main St'
        )
        self.slot_type = SlotType.objects.create(
            name='standard',  # must match one of SLOT_CHOICES keys
            description='Standard parking slot',
            type='basic'
        )
        self.vehicle_type = VehicleType.objects.create(
            name='Car'
        )

        # Create reservation
        self.reservation = Reservation.objects.create(
            user=self.normal_user,
            location=self.location,
            slot_type=self.slot_type,
            vehicle_type=self.vehicle_type,
            date='2025-06-25',
            time='12:00',
            duration_hours=2,
            plate_number='ABC123',
            vehicle_make='Toyota',
            vehicle_model='Corolla',
            color='Blue',
            mode_of_payment='cash',
            is_paid=False,
            is_cancelled=False,
            has_arrived=False,
            has_exited=False,
            is_approved=False
        )

    def test_approve_reservation(self):
        # Test approving a reservation works
        self.reservation.is_approved = True
        self.reservation.save()
        self.reservation.refresh_from_db()
        self.assertTrue(self.reservation.is_approved)

    def test_cancel_reservation(self):
        # Test cancelling a reservation
        self.reservation.is_cancelled = True
        self.reservation.save()
        self.reservation.refresh_from_db()
        self.assertTrue(self.reservation.is_cancelled)

    def test_mark_arrived(self):
        # Test marking reservation as arrived
        self.reservation.has_arrived = True
        self.reservation.save()
        self.reservation.refresh_from_db()
        self.assertTrue(self.reservation.has_arrived)

    def test_mark_exited(self):
        # Test marking reservation as exited
        self.reservation.has_exited = True
        self.reservation.save()
        self.reservation.refresh_from_db()
        self.assertTrue(self.reservation.has_exited)

    def test_reservation_fields(self):
        # Test if reservation fields are saved correctly
        self.assertEqual(self.reservation.plate_number, 'ABC123')
        self.assertEqual(self.reservation.vehicle_make, 'Toyota')
        self.assertEqual(self.reservation.vehicle_model, 'Corolla')
        self.assertEqual(self.reservation.color, 'Blue')
        self.assertEqual(self.reservation.mode_of_payment, 'cash')