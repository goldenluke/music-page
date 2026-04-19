import random

def get_feed(limit=10):
    from music.models import Post

    posts = list(Post.objects.all())

    if not posts:
        return []

    sample = random.sample(posts, min(limit, len(posts)))

    return [
        {
            "id": p.id,
            "title": p.title
        }
        for p in sample
    ]
