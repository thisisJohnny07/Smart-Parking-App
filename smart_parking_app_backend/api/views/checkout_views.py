import base64
import os
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.payment_serializers import CheckoutSessionSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    # Validate the incoming request data
    serializer = CheckoutSessionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'message': 'Invalid input', 'errors': serializer.errors}, status=400)
    validated = serializer.validated_data

    # Get billing details from authenticated user
    user = request.user
    billing_name = user.get_full_name() or user.username
    billing_email = user.email

    # Retrieve and encode PayMongo secret key
    secret_key = os.getenv('PAYMONGO_SECRET_KEY')
    if not secret_key:
        return Response({'error': 'PayMongo secret key missing'}, status=500)
    encoded_key = base64.b64encode(secret_key.encode()).decode()
    headers = {
        'Authorization': f'Basic {encoded_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    # Prepare payload with validated data
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
                "success_url": "http://localhost:5173/payment-callback",
                "reference_number": "REF123456"
            }
        }
    }

    try:
        # Send the checkout session request to PayMongo
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
    except requests.exceptions.RequestException as e:
        # Handle network errors or request failures gracefully
        return Response({'success': False, 'message': 'Request to PayMongo failed', 'error': str(e)}, status=503)
    except Exception as e:
        # Catch-all for any unexpected errors (e.g., JSON decode errors)
        return Response({'success': False, 'message': 'Unexpected server error', 'error': str(e)}, status=500)