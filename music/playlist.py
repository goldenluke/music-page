import random
from .models import Post, UserEvent
from .embeddings import cosine_similarity

def get_user_history(user):
    return UserEvent.objects.filter(user=user).order_by("-id")[:20]

def get_last_post(user):
    last = UserEvent.objects.filter(user=user).order_by("-id").first()
    return last.post if last else None

def generate_playlist(user, limit=10):
    posts = Post.objects.all()
    seen_ids = set(UserEvent.objects.filter(user=user).values_list("post_id", flat=True))

    last_post = get_last_post(user)

    # fallback
    if not last_post or not last_post.embedding:
        return list(posts.order_by("-score")[:limit])

    results = []

    for p in posts:
        if not p.embedding or p.id in seen_ids:
            continue

        score = cosine_similarity(last_post.embedding, p.embedding)

        results.append((score, p))

    results.sort(key=lambda x: x[0], reverse=True)

    return [p for s, p in results[:limit]]


# -------------------------
# AUTOPLAY (1 próxima música)
# -------------------------
def next_track(user):
    playlist = generate_playlist(user, limit=1)

    return playlist[0] if playlist else None
