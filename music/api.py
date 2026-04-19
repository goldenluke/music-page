from music.api_posts_fix import apply_posts_fix
from ninja import NinjaAPI
from django.db.models import Count

api = NinjaAPI()


# =========================
# SERIALIZER
# =========================

def serialize_post(p):
    return {
        "id": p.id,
        "title": p.title,
        "sub": p.sub.name if p.sub else "",
        "genre": p.genre.name if p.genre else ""
    }


# =========================
# SUBS (USANDO MODEL REAL)
# =========================


@api.get("/subs")
def subs(request):
    from music.models import Sub
    from django.db.models import Count

    qs = Sub.objects.annotate(count=Count("posts")).order_by("-count")

    return [
        {
            "name": s.name,
            "slug": s.slug,
            "count": s.count
        }
        for s in qs
    ]
apply_posts_fix(api)

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


# =========================
# REGISTER
# =========================
@api.post("/register")
def register(request, payload: dict):
    username = payload.get("username")
    password = payload.get("password")
    email = payload.get("email")

    if not username or not password:
        return {"error": "missing fields"}

    if User.objects.filter(username=username).exists():
        return {"error": "user exists"}

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    login(request, user)

    return {
        "id": user.id,
        "username": user.username
    }


# =========================
# LOGIN
# =========================

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from music.schemas import AuthSchema, RegisterSchema


# =========================
# REGISTER
# =========================
@api.post("/register")
def register(request, payload: RegisterSchema):
    if User.objects.filter(username=payload.username).exists():
        return {"error": "user exists"}

    user = User.objects.create_user(
        username=payload.username,
        password=payload.password,
        email=payload.email
    )

    login(request, user)

    return {
        "id": user.id,
        "username": user.username
    }


# =========================
# LOGIN
# =========================
@api.post("/login")
def login_view(request, payload: AuthSchema):
    user = authenticate(
        request,
        username=payload.username,
        password=payload.password
    )

    if not user:
        return {"error": "invalid credentials"}

    login(request, user)

    return {
        "id": user.id,
        "username": user.username
    }


# =========================
# LOGOUT
# =========================
@api.post("/logout")
def logout_view(request):
    logout(request)
    return {"ok": True}


# =========================
# ME
# =========================
@api.get("/me")
def me(request):
    if not request.user.is_authenticated:
        return {}

    return {
        "id": request.user.id,
        "username": request.user.username
    }


from music.services.youtube import search_youtube

@api.get("/youtube/search")
def youtube_search(request, q: str):
    return search_youtube(q)


from music.services.graph import build_graph

@api.get("/graph")
def graph(request, node: str):
    return build_graph(node)


from music.services.leaderboard import get_top_scouts

@api.get("/leaderboard")
def leaderboard(request):
    return get_top_scouts()


from music.services.analytics import get_analytics

@api.get("/analytics")
def analytics(request):
    return get_analytics()


from music.services.trends import get_trends

@api.get("/trends")
def trends(request):
    return get_trends()


from music.services.notifications import get_notifications

@api.get("/notifications")
def notifications(request):
    return get_notifications(request.user if request.user.is_authenticated else None)


from music.services.feed import hybrid_feed

@api.get("/feed")
def get_feed(request, city: str = None):
    data = hybrid_feed(request.user, city)
    return data

from django.shortcuts import get_object_or_404
from music.models import Event, EventInteraction

@api.get("/events/{event_id}")
def event_detail(request, event_id: int):
    e = get_object_or_404(Event, id=event_id)

    return {
        "id": e.id,
        "title": e.title,
        "city": e.city,
        "date": e.date,
        "venue": e.venue,
        "genre": e.genre.name if e.genre else None
    }


@api.post("/events/{event_id}/going")
def event_going(request, event_id: int):
    if not request.user.is_authenticated:
        return {"error": "auth required"}

    e = get_object_or_404(Event, id=event_id)

    EventInteraction.objects.create(
        user=request.user,
        event=e,
        interaction_type="going"
    )

    return {"status": "ok"}

