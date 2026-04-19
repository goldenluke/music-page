def search_posts(q):
    from music.models import Post

    if not q:
        return []

    words = q.lower().split()

    results = []

    for p in Post.objects.all():
        text = f"{p.title} {getattr(p, 'genre', '')} {getattr(p, 'sub', '')}".lower()

        score = 0

        for w in words:
            if w in text:
                score += 1

        if score > 0:
            results.append({
                "id": p.id,
                "title": p.title,
                "score": score
            })

    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:20]
