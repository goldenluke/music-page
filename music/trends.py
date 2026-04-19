from django.utils import timezone
from datetime import timedelta
from .models import Post
from collections import Counter
from django.db.models import Avg

def get_trends_data(days=7):
    start_date = timezone.now() - timedelta(days=days)
    posts = Post.objects.filter(created_at__gte=start_date)
    
    all_tags = []
    for p in posts:
        tags = p.semantic_data.get('tags', [])
        all_tags.extend(tags)
    
    top_genres = dict(Counter(all_tags).most_common(10))
    vibe_radar = posts.aggregate(
        energy=Avg('audio_features__energy'),
        danceability=Avg('audio_features__danceability'),
        valence=Avg('audio_features__valence')
    )

    top_artists = {}
    for p in posts:
        if p.artist:
            name = p.artist.name
            top_artists[name] = top_artists.get(name, 0) + (1 + p.score)
    
    sorted_artists = dict(sorted(top_artists.items(), key=lambda item: item[1], reverse=True)[:5])

    return {
        "period_name": "Hoje" if days == 1 else "Esta Semana" if days == 7 else "Este Mês",
        "post_count": posts.count(),
        "top_genres": top_genres,
        "vibe_radar": {k: (v or 0) for k, v in vibe_radar.items()},
        "top_artists": sorted_artists
    }
