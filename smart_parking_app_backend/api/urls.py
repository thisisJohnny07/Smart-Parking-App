from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Import views from their respective modules
from .views.auth_views import MyTokenObtainPairView, register_user, logout_user, change_password
from .views.location_views import create_location_with_pricings, location_list_with_slot_details, update_location_with_pricings, delete_location, check_slot_availability, locations_and_vehicle_types
from .views.reservation_views import create_reservation, user_reservations, cancel_reservation, mark_reservation_as_paid, admin_all_reservations, admin_cancel_reservation, mark_check_in, mark_check_out, approve_reservation
from .views.user_views import deactivate_user, activate_user, view_regular_users, update_profile, view_profile
from .views.notification_views import mark_all_notifications_read, count_unread_notifications, list_unread_notifications
from .views.checkout_views import create_checkout_session
from .views.dashboard_views import admin_dashboard_summary

urlpatterns = [
    # Auth
    path('register/', register_user, name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_user, name='logout'),
    path('user/change-password/', change_password, name='change_password'),
    path('user/update/', update_profile, name='update_profile'),
    path('user/profile/', view_profile, name='view_profile'),

    # Location
    path('locations/create/', create_location_with_pricings, name='create_location'),
    path('locations/', location_list_with_slot_details, name='location-list'),
    path('locations/update/<int:location_id>/', update_location_with_pricings, name='update_location'),
    path('locations/delete/<int:location_id>/', delete_location, name='delete_location'),
    path('slots/check-availability/', check_slot_availability, name='check_slot_availability'),
    path('data/locations-vehicles/', locations_and_vehicle_types, name='locations-and-vehicles'),

    # Reservation
    path('reservations/create/', create_reservation, name='create_reservation'),
    path('reservations/my/', user_reservations, name='user_reservations'),
    path('reservations/<int:reservation_id>/cancel/', cancel_reservation, name='cancel_reservation'),
    path('reservations/<int:reservation_id>/mark-paid/', mark_reservation_as_paid, name='mark_reservation_as_paid'),
    path('reservations/<int:reservation_id>/approve/', approve_reservation, name='approve_reservation'),

    # Admin Reservation Management
    path('admin/reservations/', admin_all_reservations, name='admin_all_reservations'),
    path('admin/reservations/<int:reservation_id>/cancel/', admin_cancel_reservation, name='admin_cancel_reservation'),
    path('admin/reservations/<int:reservation_id>/check-in/', mark_check_in, name='mark_check_in'),
    path('admin/reservations/<int:reservation_id>/check-out/', mark_check_out, name='mark_check_out'),

    # User Management (admin)
    path('admin/deactivate-user/', deactivate_user, name='deactivate_user'),
    path('admin/activate-user/', activate_user, name='activate_user'),
    path('users/', view_regular_users, name='view_regular_users'),

    # Notifications
    path('notifications/mark-all-read/', mark_all_notifications_read, name='mark_all_notifications_read'),
    path('notifications/count/', count_unread_notifications, name='count_unread_notifications'),
    path('notifications/unread/', list_unread_notifications, name='list_unread_notifications'),

    # Payments / Checkout
    path('online-payments/', create_checkout_session, name='online_payment'),

    # Dashboard
    path('admin/dashboard/summary/', admin_dashboard_summary, name='dashboard_summary'),
]