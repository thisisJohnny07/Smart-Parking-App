from django.urls import path
from .views import create_reservation, register_user, logout_user, create_location_with_pricings, update_location_with_pricings, delete_location, check_slot_availability, user_reservations
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_user, name='logout'),
    path('locations/create/', create_location_with_pricings, name='create_location'),
    path('locations/update/<int:location_id>/', update_location_with_pricings, name='update_location'),
    path('locations/delete/<int:location_id>/', delete_location, name='delete_location'),
    path('slots/check-availability/', check_slot_availability, name='check_slot_availability'),
    path('reservations/create/', create_reservation, name='create_reservation'),
    path('reservations/my/', user_reservations, name='user_reservations'),
]