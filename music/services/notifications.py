from collections import Counter
from django.utils import timezone
from datetime import timedelta

def get_notifications(user=None):
    from music.models import UserEvent, Post

    if not user or not user.is_authenticated:
        return []

    now = timezone.now()
    last_7 = now - timedelta(days=7)

    # =========================
    # EVENTOS DO USUÁRIO
    # =========================
    user_events = UserEvent.objects.filter(
        user=user,
        created_at__gte=last_7
    ).select_related("post__genre")

    if not user_events.exists():
        return []

    # =========================
    # PERFIL DO USUÁRIO
    # =========================
    genre_counter = Counter()

    for e in user_events:
        if e.post and e.post.genre:
            genre_counter[e.post.genre.name] += 1

    top_genres = [g for g, _ in genre_counter.most_common(3)]

    notifications = []

    # =========================
    # POSTS NOVOS RELEVANTES
    # =========================
    recent_posts = Post.objects.filter(
        created_at__gte=last_7
    ).select_related("genre")

    for p in recent_posts:
        if p.genre and p.genre.name in top_genres:
            notifications.append({
                "type": "recommendation",
                "text": f"Novo post em {p.genre.name}: {p.title}",
                "post_id": p.id
            })

    # =========================
    # DETECÇÃO DE MUDANÇA DE INTERESSE
    # =========================
    if len(top_genres) >= 2:
        notifications.append({
            "type": "pattern",
            "text": f"Você está explorando {top_genres[0]} e {top_genres[1]}"
        })

    # =========================
    # ENGAJAMENTO REAL
    # =========================
    total = user_events.count()

    notifications.append({
        "type": "activity",
        "text": f"Você teve {total} interações nos últimos 7 dias"
    })

    return notifications[:10]
