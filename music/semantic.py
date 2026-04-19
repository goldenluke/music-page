def build_semantic_data(post):
    data = {}

    if post.artist:
        data["artist"] = post.artist.name

    if post.genre:
        data["genre"] = post.genre.name

    if post.title:
        data["keywords"] = post.title.lower().split()

    return data
