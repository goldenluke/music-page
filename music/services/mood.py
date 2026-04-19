from django.db.models import Q

def mood_search(query):
    return (
        Q(title__icontains=query) |
        Q(artist__name__icontains=query) |
        Q(genre__name__icontains=query) |
        Q(sub__name__icontains=query)
    )
