from django.shortcuts import render

# Create your views here.

from django.db.models import Count
from collections import defaultdict
import random

def smart_feed(request):
    user = request.user

    events = UserEvent.objects.filter(user=user)

    weights = defaultdict(int)

    for e in events:
        if e.post_id:
            if e.event_type == "view":
                weights[e.post_id] += 1
            elif e.event_type == "like":
                weights[e.post_id] += 3
            elif e.event_type == "save":
                weights[e.post_id] += 5
            elif e.event_type == "skip":
                weights[e.post_id] -= 2

    posts = list(Post.objects.all())

    def score(post):
        return weights.get(post.id, 0) + random.random()

    ranked = sorted(posts, key=score, reverse=True)[:50]

    data = [
        {
            "id": p.id,
            "title": p.title,
            "score": score(p)
        }
        for p in ranked
    ]

    return JsonResponse(data, safe=False)


def local_trends(request):
    city = request.GET.get("city", "")

    qs = PostContext.objects.all()

    if city:
        qs = qs.filter(city__iexact=city)

    top = qs.values("mood").annotate(count=Count("id")).order_by("-count")[:10]

    return JsonResponse(list(top), safe=False)

