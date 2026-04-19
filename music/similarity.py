import math

def build_artist_vector(artist, all_genres):
    genre_ids = set(g.id for g in artist.genres.all())
    return [1 if g.id in genre_ids else 0 for g in all_genres]

def cosine_similarity(v1, v2):
    dot = sum(a*b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a*a for a in v1))
    norm2 = math.sqrt(sum(b*b for b in v2))

    if norm1 == 0 or norm2 == 0:
        return 0

    return dot / (norm1 * norm2)

def find_similar_artists(target, artists, genres):
    target_vec = build_artist_vector(target, genres)

    scores = []

    for artist in artists:
        if artist.id == target.id:
            continue

        vec = build_artist_vector(artist, genres)
        sim = cosine_similarity(target_vec, vec)

        scores.append((sim, artist))

    scores.sort(key=lambda x: x[0], reverse=True)

    return [a for _, a in scores[:10]]
