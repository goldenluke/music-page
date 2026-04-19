from music.services.serializer import serialize_post

def apply_posts_fix(api):

    @api.get("/posts")
    def posts(request, sub_slug: str = None, limit: int = 10, offset: int = 0):
        from music.models import Post

        qs = Post.objects.select_related("sub", "genre")

        if sub_slug:
            qs = qs.filter(sub__slug=sub_slug)

        qs = qs.order_by("-id")[offset:offset+limit]

        return [serialize_post(p) for p in qs]


    @api.get("/feed/rl")
    def feed(request, sub_slug: str = None, limit: int = 10, offset: int = 0):
        from music.models import Post

        qs = Post.objects.select_related("sub", "genre")

        if sub_slug:
            qs = qs.filter(sub__slug=sub_slug)

        qs = qs.order_by("-id")[offset:offset+limit]

        return [serialize_post(p) for p in qs]

