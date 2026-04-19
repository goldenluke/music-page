from collections import defaultdict
from django.utils import timezone
from datetime import timedelta

def get_trends():
    from music.models import UserEvent

    now = timezone.now()
    last_7 = now - timedelta(days=7)
    prev_7 = now - timedelta(days=14)

    recent = UserEvent.objects.filter(created_at__gte=last_7)
    previous = UserEvent.objects.filter(
        created_at__gte=prev_7,
        created_at__lt=last_7
    )

    def count_by_genre(qs):
        counts = defaultdict(int)
        for e in qs.select_related("post__genre"):
            if e.post and e.post.genre:
                counts[e.post.genre.name] += 1
        return counts

    recent_counts = count_by_genre(recent)
    prev_counts = count_by_genre(previous)

    insights = []

    for genre in recent_counts:
        r = recent_counts.get(genre, 0)
        p = prev_counts.get(genre, 0)

        if p == 0:
            if r > 5:
                insights.append(f"🚀 Novo crescimento em {genre}")
            continue

        change = ((r - p) / p) * 100

        if change > 20:
            insights.append(f"🔥 {genre} subiu {int(change)}%")
        elif change < -20:
            insights.append(f"📉 {genre} caiu {int(change)}%")

    if not insights:
        insights.append("Nada relevante detectado ainda")

    return insights
