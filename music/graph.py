from collections import defaultdict
from .models import Post

def build_graph():
    graph = defaultdict(set)
    # Buscamos todos os posts com dados relacionados
    posts = Post.objects.all().select_related('artist', 'genre')

    for p in posts:
        # Extrair nomes em minúsculo para evitar duplicatas
        artist = p.artist.name.lower() if p.artist else None
        genre = p.genre.name.lower() if p.genre else None
        tags = [t.lower() for t in p.semantic_data.get("tags", [])]

        nodes = []
        if artist: nodes.append(artist)
        if genre: nodes.append(genre)
        nodes.extend(tags)

        # Conectar cada item a todos os outros no mesmo post (Clique completo)
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                u, v = nodes[i], nodes[j]
                graph[u].add(v)
                graph[v].add(u)

    return graph

def related(node, limit=12):
    if not node: return []
    graph = build_graph()
    search_term = node.lower().strip()

    if search_term not in graph:
        # Tenta uma busca parcial se não achar o termo exato
        for key in graph.keys():
            if search_term in key:
                search_term = key
                break
        else:
            return []

    # Retorna os vizinhos convertidos para Título
    return sorted([name.title() for name in list(graph[search_term])])[:limit]
