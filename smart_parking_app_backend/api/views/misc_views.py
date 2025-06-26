# Placeholder for other miscellaneous views, utilities, or health checks.

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """
    Basic health check endpoint to verify server is running.
    """
    return Response({"status": "ok"}, status=200)