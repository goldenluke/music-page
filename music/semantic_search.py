from .models import Post
from .embeddings import get_embedding, cosine_similarity

def semantic_search(query):
    query_emb = get_embedding(query)

    results = []

    for post in Post.objects.all():
        if not post.embedding:
            continue

        score = cosine_similarity(query_emb, post.embedding)
        results.append((score, post))

    results.sort(key=lambda x: x[0], reverse=True)

    return [
        {"title": p.title, "score": float(s)}
        for s, p in results[:10]
    ]
