from collections import Counter
from .ranking import hot_score
from .bandit import choose

def build_user_profile(user):
    from music.models import UserEvent

    events = UserEvent.objects.filter(user=user).select_related("post")

    artists = []
    genres = []
    subs = []

    for e in events:
        p = e.post
        if p.artist:
            artists.append(p.artist.id)
        if p.genre:
            genres.append(p.genre.id)
        if p.sub:
            subs.append(p.sub.id)

    return {
        "artists": Counter(artists),
        "genres": Counter(genres),
        "subs": Counter(subs)
    }


def affinity_score(post, profile):
    score = 0

    if post.artist and post.artist.id in profile["artists"]:
        score += 3

    if post.genre and post.genre.id in profile["genres"]:
        score += 2

    if post.sub and post.sub.id in profile["subs"]:
        score += 1

    return score


def hybrid_rank(posts, user):
    profile = build_user_profile(user)

    scored = []

    for p in posts:
        hot = hot_score(p.score or 1, p.created_at)
        affinity = affinity_score(p, profile)

        base = (hot * 0.7) + (affinity * 0.3)

        scored.append((base, p))

    scored.sort(key=lambda x: x[0], reverse=True)

    ordered = [p for _, p in scored]

    # 🔥 BANDIT AQUI
    return choose(ordered)
