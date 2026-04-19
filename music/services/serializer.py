def serialize_post(p):
    return {
        "id": p.id,
        "title": p.title,
        "genre": p.genre.name if p.genre else "",
        "sub": p.sub.slug if p.sub else ""
    }
