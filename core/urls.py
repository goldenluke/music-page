from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from music.api import api # Importa a instância da sua API Ninja

urlpatterns = [
    # Rota para o painel administrativo do Django
    path('admin/', admin.site.urls),
    
    # Rota base para todos os endpoints da sua API (ex: /api/posts, /api/login)
    path("api/", api.urls),
]

# Configuração para servir arquivos de mídia (fotos/imagens) durante o desenvolvimento.
# Sem as linhas abaixo, o link da imagem que o Django retorna não funcionará no navegador.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)