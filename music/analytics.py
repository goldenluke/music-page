from django.db.models import Count
from .models import UserEvent, Post, Artist

def get_analytics():
    total_events = UserEvent.objects.count()

    top_posts = (
        Post.objects
        .annotate(events=Count("userevent"))
        .order_by("-events")[:5]
    )

    top_artists = (
        Artist.objects
        .annotate(events=Count("posts__userevent"))
        .order_by("-events")[:5]
    )

    event_types = (
        UserEvent.objects
        .values("event_type")
        .annotate(count=Count("id"))
    )

    return {
        "total_events": total_events,
        "top_posts": [
            {"title": p.title, "events": p.events}
            for p in top_posts
        ],
        "top_artists": [
            {"name": a.name, "events": a.events}
            for a in top_artists
        ],
        "event_types": list(event_types)
    }
