from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from music.api import api # Importa a instância da sua API
from django.http import HttpResponse

def home(request):
    return HttpResponse("Music Page API está rodando 🚀")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path("api/", api.urls),
]

# Configuração para servir arquivos de mídia (fotos/imagens) durante o desenvolvimento.
# Sem as linhas abaixo, o link da imagem que o Django retorna não funcionará no navegador.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
