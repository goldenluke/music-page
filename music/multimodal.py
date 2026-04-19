import numpy as np
from .models import Post, UserEvent
from .embeddings import cosine_similarity

def vibe_similarity(a, b):
    if not a or not b:
        return 0

    keys = ["energy", "danceability", "tempo", "valence"]

    diffs = []
    for k in keys:
        diffs.append(abs(a.get(k, 0) - b.get(k, 0)))

    return 1 - (sum(diffs) / len(diffs))


def multimodal_score(user_emb, post, ref_post):
    text_sim = cosine_similarity(user_emb, post.embedding) if post.embedding else 0
    vibe_sim = vibe_similarity(ref_post.audio_features, post.audio_features)

    return text_sim * 0.6 + vibe_sim * 0.4


def multimodal_feed(user, limit=10):
    events = UserEvent.objects.filter(user=user).order_by("-id")
    ref = events.first().post if events else None

    user_emb = None
    embeddings = [e.post.embedding for e in events if e.post.embedding]

    if embeddings:
        user_emb = np.mean(embeddings, axis=0)

    results = []

    for post in Post.objects.all():
        if not post.embedding or not post.audio_features:
            continue

        score = multimodal_score(user_emb, post, ref)
        results.append((score, post))

    results.sort(key=lambda x: x[0], reverse=True)

    return [p for s, p in results[:limit]]
