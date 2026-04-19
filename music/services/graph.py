from collections import Counter

def build_graph(node):
    from music.models import Post

    posts = Post.objects.select_related("genre", "sub")

    # filtra posts relacionados ao node
    related = posts.filter(
        genre__name__icontains=node
    ) | posts.filter(
        sub__name__icontains=node
    )

    counter = Counter()

    for p in related:
        if p.genre and p.genre.name != node:
            counter[p.genre.name] += 1

        if p.sub and p.sub.name != node:
            counter[p.sub.name] += 1

    nodes = [
        {"name": k, "weight": v}
        for k, v in counter.most_common(10)
    ]

    return {
        "nodes": nodes
    }
