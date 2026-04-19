import numpy as np
import random
from django.utils import timezone
from .models import Post, UserEvent
from .embeddings import cosine_similarity
from .rl import get_weights

def average_embedding(embeddings):
    if not embeddings:
        return None
    return np.mean(np.array(embeddings), axis=0)

def get_user_embedding(user):
    events = UserEvent.objects.filter(user=user)
    embeddings = [e.post.embedding for e in events if e.post.embedding]
    return average_embedding(embeddings)

def smart_feed(user, limit=10):
    weights = get_weights()

    user_emb = get_user_embedding(user)
    posts = Post.objects.all()

    if user_emb is None:
        return posts.order_by("-score")[:limit]

    results = []

    for post in posts:
        if not post.embedding:
            continue

        sim = cosine_similarity(user_emb, post.embedding)
        popularity = post.score

        age_days = (timezone.now() - post.created_at).days
        recency = max(0, 1 - age_days / 30)

        final = (
            sim * weights["similarity"] +
            popularity * weights["popularity"] +
            recency * weights["recency"]
        )

        results.append((final, post))

    results.sort(key=lambda x: x[0], reverse=True)

    return [p for s, p in results[:limit]]
