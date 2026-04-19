from music.models import Post, Artist, Genre, Sub

def ingest_simple(data):
    artist, _ = Artist.objects.get_or_create(name=data.get("artist", "Unknown"))
    genre, _ = Genre.objects.get_or_create(name=data.get("genre", "Unknown"))
    sub, _ = Sub.objects.get_or_create(name=data.get("sub", "Geral"), slug=data.get("sub", "geral"))

    post = Post.objects.create(
        title=data["title"],
        artist=artist,
        genre=genre,
        sub=sub,
        thumbnail=data.get("thumbnail"),
        score=0
    )

    return post
