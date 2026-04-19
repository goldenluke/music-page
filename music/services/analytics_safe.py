from django.db.models import Count

def get_analytics():
    from music.models import UserEvent

    qs = (
        UserEvent.objects
        .exclude(post_id=None)
        .values("post_id")
        .annotate(score=Count("id"))
        .order_by("-score")[:20]
    )

    return list(qs)
