import math
from datetime import datetime, timezone

EPOCH = 1134028003  # constante do Reddit

def hot_score(score, created_at):
    s = score if score != 0 else 1

    order = math.log10(abs(s))
    sign = 1 if s > 0 else -1 if s < 0 else 0

    seconds = created_at.timestamp() - EPOCH

    return round(sign * order + seconds / 45000, 7)


def rank_posts(posts):
    ranked = []

    for p in posts:
        score = p.score or 0
        created = p.created_at

        hot = hot_score(score, created)

        ranked.append((hot, p))

    ranked.sort(key=lambda x: x[0], reverse=True)

    return [p for _, p in ranked]
