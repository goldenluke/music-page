import dotenv
dotenv.load_dotenv()
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'dev-key'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'music',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'music.middleware.ApiCsrfExemptMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'music.middleware.UpdateLastSeenMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = []

WSGI_APPLICATION = 'core.wsgi.application'

# =========================
# POSTGRES CONFIG CORRETO
# =========================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'musicpage',
        'USER': 'musicuser',
        'PASSWORD': 'musicpass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# =========================
# RESTO BÁSICO
# =========================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =========================
# TEMPLATES (REQUIRED FOR ADMIN)
# =========================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
CORS_ALLOW_ALL_ORIGINS = True
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Configurações de CORS e CSRF para o Frontend Vite
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# --- CONFIGURAÇÕES PARA NGROK ---
ALLOWED_HOSTS = ["musicabr.ngrok.app", "localhost", "127.0.0.1"]

CSRF_TRUSTED_ORIGINS = [
    "https://musicabr.ngrok.app",
]

# Informa ao Django que ele está atrás de um proxy reverso (ngrok) que usa HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# --- CORREÇÃO DE AUTENTICAÇÃO E CSRF PARA NGROK ---
ALLOWED_HOSTS = ["*"] # Em dev com ngrok, o host muda com frequência

CSRF_TRUSTED_ORIGINS = [
    "https://musicabr.ngrok.app",
]

# Configurações de Cookie para Sessão e CSRF (Obrigatório para HTTPS)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SAMESITE = 'None'

# Garante que o Django aceite o login através do proxy do ngrok
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# --- CONFIGURAÇÃO FINAL DE SEGURANÇA E CONEXÃO ---

INSTALLED_APPS += ['corsheaders']

# O CorsMiddleware deve vir o mais alto possível, antes do CommonMiddleware
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')

# Domínios que podem acessar a API (Frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://musicabr.ngrok.app",
]

# Domínios confiáveis para enviar formulários (POST)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://musicabr.ngrok.app",
]

# Permitir envio de Cookies de autenticação
CORS_ALLOW_CREDENTIALS = True

# Ajustes de Cookie para funcionar em ambientes mistos (HTTP local + HTTPS ngrok)
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False  # Mantenha False para conseguir logar no localhost:3001
CSRF_COOKIE_SECURE = False

# Se estiver acessando via ngrok (HTTPS), o Django precisa saber
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Ajustes para permitir login sem CSRF em ambiente de desenvolvimento
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False

# --- CORREÇÃO DE COOKIES PARA NGROK E LOCALHOST ---
CSRF_TRUSTED_ORIGINS = [
    "https://musicabr.ngrok.app",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# Permitir que cookies de sessão funcionem entre o túnel Ngrok e o Localhost
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False  # Mude para True se for usar APENAS Ngrok
CSRF_COOKIE_SECURE = False

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

SESSION_COOKIE_SAMESITE = "Lax"
