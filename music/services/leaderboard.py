from django.db.models import Count

def get_top_scouts():
    from music.models import UserEvent

    # contar likes por usuário
    qs = (
        UserEvent.objects
        .filter(event_type="like")
        .values("user__username")
        .annotate(score=Count("id"))
        .order_by("-score")[:10]
    )

    return [
        {
            "user": x["user__username"],
            "score": x["score"]
        }
        for x in qs
    ]
