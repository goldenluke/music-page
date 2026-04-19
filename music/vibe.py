from .models import Post
from .spotify import search_spotify, get_audio_features

def enrich_vibe():
    for post in Post.objects.all():
        try:
            results = search_spotify(post.title, limit=1)

            if not results:
                continue

            track = results[0]

            # extrair ID da URL
            track_id = track["spotify_url"].split("/")[-1]

            features = get_audio_features(track_id)

            post.audio_features = features
            post.save()

            print("✔ vibe:", post.title)

        except Exception as e:
            print("erro:", e)
