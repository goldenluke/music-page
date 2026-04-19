from .embeddings import get_embedding, cosine_similarity
from .models import Post

def serialize_post(p):
    return {
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "url": p.url,
        "embed_url": p.embed_url,
        "score": p.score,
    }

def mood_search(query):

    if not query:
        return []

    query_emb = get_embedding(query)

    results = []

    for p in Post.objects.exclude(embedding=None):

        score = cosine_similarity(query_emb, p.embedding)

        results.append((score, p))

    results.sort(key=lambda x: x[0], reverse=True)

    # 🔥 SERIALIZA AQUI
    return [serialize_post(p) for _, p in results[:20]]
