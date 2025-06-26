from rest_framework import serializers

class CheckoutSessionSerializer(serializers.Serializer):
    description = serializers.CharField()
    billing_phone = serializers.CharField()
    line_item_amount = serializers.FloatField()
    line_item_name = serializers.CharField()
    line_item_quantity = serializers.IntegerField()
    currency = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=['card', 'gcash', 'paymaya'])