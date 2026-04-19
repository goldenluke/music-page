from .spotify import search_spotify
from .youtube import search_youtube
from .embeddings import get_embedding, cosine_similarity

def hybrid_playlist(query, limit=5):
    spotify_tracks = search_spotify(query, limit=limit)

    results = []

    for track in spotify_tracks:
        search_query = f"{track['artist']} {track['title']}"

        yt_results = search_youtube(search_query, max_results=1)

        if not yt_results:
            continue

        yt = yt_results[0]

        # embedding combinado
        text = f"{track['artist']} {track['title']}"
        emb = get_embedding(text)

        results.append({
            "title": f"{track['artist']} - {track['title']}",
            "artist": track["artist"],
            "spotify_url": track["spotify_url"],
            "youtube_url": yt["url"],
            "embed_url": yt["embed_url"],
            "thumbnail": yt.get("thumbnail"),
            "embedding": emb
        })

    return results


# -------------------------
# ORDENAÇÃO POR IA
# -------------------------
def rank_playlist(query, items):
    query_emb = get_embedding(query)

    scored = []

    for item in items:
        score = cosine_similarity(query_emb, item["embedding"])
        scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [i for s, i in scored]
