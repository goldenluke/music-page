from django.db.models import Count

def get_analytics():
    from music.models import Post, UserEvent, Genre, Sub
    from django.contrib.auth.models import User

    total_posts = Post.objects.count()
    total_users = User.objects.count()
    total_events = UserEvent.objects.count()

    top_genres = (
        Genre.objects
        .annotate(count=Count("posts"))
        .order_by("-count")[:5]
    )

    top_subs = (
        Sub.objects
        .annotate(count=Count("posts"))
        .order_by("-count")[:5]
    )

    return {
        "total_posts": total_posts,
        "total_users": total_users,
        "total_events": total_events,
        "top_genres": [
            {"name": g.name, "count": g.count}
            for g in top_genres
        ],
        "top_subs": [
            {"name": s.name, "count": s.count}
            for s in top_subs
        ]
    }
