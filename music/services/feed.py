import random
from django.utils import timezone
from music.models import Post, Event, UserEvent

def get_user_weights(user):
    weights = {}

    if not user or not user.is_authenticated:
        return weights

    events = UserEvent.objects.filter(user=user)

    for e in events:
        pid = e.post_id
        if not pid:
            continue

        if pid not in weights:
            weights[pid] = 0

        if e.event_type == "view":
            weights[pid] += 1
        elif e.event_type == "like":
            weights[pid] += 3
        elif e.event_type == "save":
            weights[pid] += 5
        elif e.event_type == "skip":
            weights[pid] -= 2

    return weights


def hybrid_feed(user, city=None):
    now = timezone.now()

    posts = list(Post.objects.all()[:50])
    events = list(Event.objects.filter(date__gte=now)[:50])

    weights = get_user_weights(user)

    feed = []

    # =========================
    # POSTS
    # =========================
    for p in posts:
        score = (
            p.likes * 2 +
            p.views +
            weights.get(p.id, 0) +
            random.random()
        )

        feed.append({
            "type": "post",
            "id": p.id,
            "title": p.title,
            "score": score
        })

    # =========================
    # EVENTS (PRIORIDADE)
    # =========================
    for e in events:
        proximity_bonus = 0

        if city and e.city.lower() == city.lower():
            proximity_bonus = 10  # 🔥 força evento local

        score = (
            proximity_bonus +
            random.random() +
            5  # base boost (evento > post)
        )

        feed.append({
            "type": "event",
            "id": e.id,
            "title": e.title,
            "city": e.city,
            "date": e.date,
            "score": score
        })

    # =========================
    # ORDENAR
    # =========================
    feed = sorted(feed, key=lambda x: x["score"], reverse=True)

    return feed[:50]
