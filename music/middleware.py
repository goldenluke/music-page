from django.utils import timezone
from .models import Profile

class UpdateLastSeenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Primeiro, processa o restante da requisição (incluindo a autenticação)
        response = self.get_response(request)
        
        # Agora, após o AuthenticationMiddleware ter rodado, o user existe
        if hasattr(request, 'user') and request.user.is_authenticated:
            Profile.objects.filter(user=request.user).update(last_seen=timezone.now())
        
        return response

class ApiCsrfExemptMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return self.get_response(request)
