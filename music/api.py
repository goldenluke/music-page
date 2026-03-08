from ninja import NinjaAPI, Schema, File, Form
from ninja.files import UploadedFile
from ninja.security import django_auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Post, Vote, Genre, Comment, SavedPost, Profile, Notification, Sub
from typing import List, Optional

# Inicialização da API
api = NinjaAPI()

# --- 1. SCHEMAS (Definições de Dados) ---

class LoginPayload(Schema):
    username: str
    password: str

class RegisterIn(Schema):
    username: str
    email: str
    password: str

class GenreOut(Schema):
    id: int
    name: str
    slug: str

class SubOut(Schema):
    id: int
    name: str
    slug: str
    description: str
    member_count: int
    is_member: bool = False

    @staticmethod
    def resolve_member_count(obj):
        return obj.members.count()

    @staticmethod
    def resolve_is_member(obj, context):
        request = context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False

class CommentIn(Schema):
    text: str

class CommentSchema(Schema):
    id: int
    text: str
    author_username: str
    created_at: str

    @staticmethod
    def resolve_author_username(obj):
        return obj.author.username
    
    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.strftime("%H:%M - %d/%m")

class PostSchema(Schema):
    id: int
    title: str
    url: str
    content: Optional[str] = None
    image: Optional[str] = None
    score: int
    author_username: str = None
    genre_name: Optional[str] = None
    sub_slug: str = None
    voted: bool = False
    is_saved: bool = False

    @staticmethod
    def resolve_author_username(obj):
        return obj.author.username

    @staticmethod
    def resolve_genre_name(obj):
        return obj.genre.name if obj.genre else None

    @staticmethod
    def resolve_sub_slug(obj):
        return obj.sub.slug if obj.sub else "geral"

    @staticmethod
    def resolve_image(obj):
        return obj.image.url if obj.image else None

    @staticmethod
    def resolve_voted(obj, context):
        request = context.get('request')
        if request and request.user.is_authenticated:
            return Vote.objects.filter(user=request.user, post=obj).exists()
        return False

    @staticmethod
    def resolve_is_saved(obj, context):
        request = context.get('request')
        if request and request.user.is_authenticated:
            return SavedPost.objects.filter(user=request.user, post=obj).exists()
        return False

class UserProfileOut(Schema):
    username: str
    karma: int
    joined_at: str

class StatsOut(Schema):
    total_members: int
    online_count: int

class NotificationOut(Schema):
    id: int
    actor_username: str
    notification_type: str
    post_title: str
    is_read: bool
    created_at: str

    @staticmethod
    def resolve_actor_username(obj): return obj.actor.username
    @staticmethod
    def resolve_post_title(obj): return obj.post.title
    @staticmethod
    def resolve_created_at(obj): return obj.created_at.strftime("%H:%M")

# --- 2. ROTAS DE AUTENTICAÇÃO ---

@api.post("/login")
def login_user(request, data: LoginPayload):
    user = authenticate(username=data.username, password=data.password)
    if user:
        login(request, user)
        return {"success": True, "username": user.username}
    return api.create_response(request, {"detail": "Incorreto"}, status=401)

@api.post("/register")
def register_user(request, data: RegisterIn):
    if User.objects.filter(username=data.username).exists():
        return api.create_response(request, {"detail": "Username já existe"}, status=400)
    user = User.objects.create_user(username=data.username, email=data.email, password=data.password)
    login(request, user)
    return {"success": True, "username": user.username}

@api.post("/logout")
def logout_user(request):
    logout(request)
    return {"success": True}

@api.get("/me", auth=django_auth)
def me(request):
    return {"username": request.auth.username, "id": request.auth.id}

# --- 3. ROTAS DE COMUNIDADES (SUBS) ---

@api.get("/subs", response=List[SubOut])
def list_subs(request):
    return Sub.objects.all()

@api.get("/subs/{slug}", response=SubOut)
def get_sub(request, slug: str):
    return get_object_or_404(Sub, slug=slug)

@api.post("/subs/{slug}/join", auth=django_auth)
def join_sub(request, slug: str):
    sub = get_object_or_404(Sub, slug=slug)
    if sub.members.filter(id=request.auth.id).exists():
        sub.members.remove(request.auth)
        joined = False
    else:
        sub.members.add(request.auth)
        joined = True
    return {"joined": joined}

# --- 4. ROTAS DE POSTS (Feed, Busca, Gênero, Sub e Paginação) ---

@api.get("/posts", response=List[PostSchema])
def list_posts(
    request, 
    sort: str = "latest", 
    search: Optional[str] = None, 
    genre: Optional[str] = None,
    sub_slug: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
):
    posts = Post.objects.all()
    if search:
        posts = posts.filter(title__icontains=search)
    if genre:
        posts = posts.filter(genre__slug=genre)
    if sub_slug:
        posts = posts.filter(sub__slug=sub_slug)
    
    order = '-score' if sort == 'top' else '-created_at'
    return posts.order_by(order)[offset : offset + limit]

@api.post("/posts", auth=django_auth)
def create_post(
    request, 
    title: str = Form(...), 
    url: str = Form(...), 
    sub_id: int = Form(...), # Agora obrigatório escolher a comunidade
    content: str = Form(""), 
    genre_id: Optional[int] = Form(None),
    image: UploadedFile = File(None)
):
    post = Post.objects.create(
        title=title, url=url, content=content,
        sub_id=sub_id, genre_id=genre_id, image=image, author=request.auth
    )
    return {"id": post.id}

# --- 5. INTERAÇÕES: VOTOS, COMENTÁRIOS E SAVED ---

@api.post("/posts/{post_id}/upvote", auth=django_auth)
def upvote(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    vote_qs = Vote.objects.filter(user=request.auth, post=post)
    if vote_qs.exists():
        vote_qs.delete()
        post.score -= 1
        voted = False
    else:
        Vote.objects.create(user=request.auth, post=post)
        post.score += 1
        voted = True
    post.save()
    return {"score": post.score, "voted": voted}

@api.post("/posts/{post_id}/save", auth=django_auth)
def toggle_save_post(request, post_id: int):
    post = get_object_or_404(Post, id=post_id)
    saved_qs = SavedPost.objects.filter(user=request.auth, post=post)
    if saved_qs.exists():
        saved_qs.delete()
        saved = False
    else:
        SavedPost.objects.create(user=request.auth, post=post)
        saved = True
    return {"is_saved": saved}

@api.get("/posts/{post_id}/comments", response=List[CommentSchema])
def list_comments(request, post_id: int):
    return Comment.objects.filter(post_id=post_id).order_by('-created_at')

@api.post("/posts/{post_id}/comments", auth=django_auth)
def create_comment(request, post_id: int, data: CommentIn):
    post = get_object_or_404(Post, id=post_id)
    Comment.objects.create(post=post, author=request.auth, text=data.text)
    return {"success": True}

# --- 6. PERFIS, NOTIFICAÇÕES E STATS ---

@api.get("/stats", response=StatsOut)
def get_stats(request):
    total_members = User.objects.count()
    limit = timezone.now() - timedelta(minutes=5)
    online_count = Profile.objects.filter(last_seen__gte=limit).count()
    return {"total_members": total_members, "online_count": max(online_count, 1)}

@api.get("/notifications", response=List[NotificationOut], auth=django_auth)
def list_notifications(request):
    return Notification.objects.filter(recipient=request.auth)[:20]

@api.get("/genres", response=List[GenreOut])
def list_genres(request):
    return Genre.objects.all()

@api.get("/user/{username}", response=UserProfileOut)
def get_user_profile(request, username: str):
    user = get_object_or_404(User, username=username)
    karma = Post.objects.filter(author=user).aggregate(Sum('score'))['score__sum'] or 0
    return {
        "username": user.username,
        "karma": karma,
        "joined_at": user.date_joined.strftime("%B %Y")
    }

@api.get("/user/{username}/posts", response=List[PostSchema])
def list_user_posts(request, username: str):
    return Post.objects.filter(author__username=username).order_by('-created_at')

@api.get("/me/saved", response=List[PostSchema], auth=django_auth)
def list_saved_posts(request):
    saved_ids = SavedPost.objects.filter(user=request.auth).values_list('post_id', flat=True)
    return Post.objects.filter(id__in=saved_ids).order_by('-created_at')

@api.get("/notifications", response=List[NotificationOut], auth=django_auth)
def list_notifications(request):
    # Retorna as 15 mais recentes
    return Notification.objects.filter(recipient=request.auth).order_by('-created_at')[:15]

@api.post("/notifications/read-all", auth=django_auth)
def mark_notifications_as_read(request):
    Notification.objects.filter(recipient=request.auth, is_read=False).update(is_read=True)
    return {"success": True}

# music/api.py
from django.utils.text import slugify

class SubIn(Schema):
    name: str
    description: str

@api.post("/subs", auth=django_auth)
def create_sub(request, data: SubIn):
    # Verifica se já existe um nome igual ou slug igual
    slug = slugify(data.name)
    if Sub.objects.filter(slug=slug).exists():
        return api.create_response(request, {"detail": "Uma comunidade com este nome já existe."}, status=400)
    
    sub = Sub.objects.create(
        name=data.name,
        slug=slug,
        description=data.description,
        creator=request.auth
    )
    # Criador entra automaticamente como membro
    sub.members.add(request.auth)
    
    return {"id": sub.id, "slug": sub.slug}