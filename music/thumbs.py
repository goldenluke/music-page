def get_thumbnail(post):
    # =========================
    # YOUTUBE
    # =========================
    if getattr(post, "youtube_id", None):
        return f"https://img.youtube.com/vi/{post.youtube_id}/hqdefault.jpg"

    # =========================
    # SPOTIFY
    # =========================
    if hasattr(post, "spotify_image") and post.spotify_image:
        return post.spotify_image

    # =========================
    # LAST.FM (se salvo)
    # =========================
    if hasattr(post, "lastfm_image") and post.lastfm_image:
        return post.lastfm_image

    # =========================
    # JSON SEMÂNTICO
    # =========================
    if post.semantic_data and "image" in post.semantic_data:
        return post.semantic_data["image"]

    # =========================
    # FALLBACK
    # =========================
    return "https://picsum.photos/300/200"
