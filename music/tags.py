from .models import Post
from .lastfm import get_track_tags, get_artist_tags

def enrich_tags():
    for p in Post.objects.all():
        try:
            artist = p.artist.name if p.artist else ""
            title = p.title.split("-")[-1].strip()

            tags = get_track_tags(artist, title)

            if not tags:
                tags = get_artist_tags(artist)

            if not p.semantic_data:
                p.semantic_data = {}

            p.semantic_data["tags"] = tags[:10]
            p.save()

            print("✔", p.title, tags[:3])

        except Exception as e:
            print("erro:", e)
