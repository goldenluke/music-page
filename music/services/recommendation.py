from collections import defaultdict
import random

def build_user_profile(user):
    from music.models import UserEvent

    profile = defaultdict(int)

    events = UserEvent.objects.filter(user=user)

    for e in events:
        genre = str(e.post.genre) if e.post and e.post.genre else None

        if not genre:
            continue

        if e.event_type == "like":
            profile[genre] += 3
        elif e.event_type == "view":
            profile[genre] += 1

    return profile


def rank_posts(user, posts):
    profile = build_user_profile(user)

    if not profile:
        return list(posts)

    scored = []

    for p in posts:
        genre = str(p.genre) if p.genre else ""
        score = profile.get(genre, 0)

        scored.append((score, random.random(), p))

    scored.sort(key=lambda x: (x[0], x[1]), reverse=True)

    return [p for _, _, p in scored]


def get_personalized_feed(user, limit=10):
    from music.models import Post

    posts = list(Post.objects.all())

    if not posts:
        return []

    ranked = rank_posts(user, posts)

    return ranked[:limit]
