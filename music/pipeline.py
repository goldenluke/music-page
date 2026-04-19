from django.db.models import Count
from .models import Post, Artist
from .similarity import find_similar_artists

def get_user_top_artists(user):
    return Artist.objects.filter(
        posts__votes__user=user
    ).annotate(count=Count("id")).order_by("-count")[:5]

def expand_artists(top_artists):
    all_artists = list(Artist.objects.all())
    from .models import Genre
    all_genres = list(Genre.objects.all())

    expanded = set()

    for artist in top_artists:
        expanded.add(artist)
        similar = find_similar_artists(artist, all_artists, all_genres)
        for s in similar:
            expanded.add(s)

    return list(expanded)

def get_recommended_posts(user):
    top_artists = get_user_top_artists(user)
    expanded_artists = expand_artists(top_artists)

    posts = Post.objects.filter(
        artist__in=expanded_artists
    ).order_by("-score")[:30]

    return posts
