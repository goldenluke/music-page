from collections import defaultdict
from .models import Post

def build_graph():
    graph = defaultdict(set)

    for p in Post.objects.all():
        artist = p.artist.name if p.artist else None
        genre = p.genre.name if p.genre else None
        tags = p.semantic_data.get("tags", []) if p.semantic_data else []

        if artist and genre:
            graph[artist].add(genre)
            graph[genre].add(artist)

        for t in tags:
            if artist:
                graph[artist].add(t)
                graph[t].add(artist)

            if genre:
                graph[genre].add(t)
                graph[t].add(genre)

    return graph


def related(node, limit=10):
    graph = build_graph()

    if node not in graph:
        return []

    return list(graph[node])[:limit]
