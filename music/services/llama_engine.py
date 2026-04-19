import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

# MAPEAMENTO FORÇADO PRA MÚSICA
GENRE_MAP = {
    "rain": ["ambient", "lofi"],
    "rainy": ["ambient", "lofi"],
    "calm": ["ambient", "chill"],
    "relax": ["lofi", "ambient"],
    "sad": ["piano", "ambient"],
    "night": ["deep", "ambient"],
    "dark": ["techno", "deep"],
    "energy": ["techno", "edm"],
}


def normalize(words):
    expanded = set(words)

    for w in words:
        if w in GENRE_MAP:
            expanded.update(GENRE_MAP[w])

    return list(expanded)


def expand_mood_with_llama(query: str):
    prompt = f"""
Convert this mood into music genres.

Mood: "{query}"

Return only genres like:
techno, house, ambient, lofi, edm, trance
"""

    try:
        res = requests.post(OLLAMA_URL, json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        })

        text = res.json()["response"]

        words = [w.strip().lower() for w in text.split(",")]

        return normalize(words)

    except Exception as e:
        print("LLAMA ERROR:", e)
        return []


def search_with_llama(query):
    from music.models import Post

    expanded = expand_mood_with_llama(query)

    print("🔥 LLAMA EXPANDED:", expanded)

    results = []

    for p in Post.objects.all():
        text = f"{p.title} {getattr(p, 'genre', '')} {getattr(p, 'sub', '')}".lower()

        score = 0

        for w in expanded:
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
