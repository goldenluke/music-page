from django.utils import timezone

def trending_score(post):
    age_hours = (timezone.now() - post.created_at).total_seconds() / 3600
    return post.score / pow((age_hours + 2), 1.5)

def affinity_score(post, user):
    score = 0

    # bônus por gênero
    if post.genre:
        user_genres = set(
            g.id for g in post.genre.__class__.objects.filter(
                posts__votes__user=user
            )
        )
        if post.genre.id in user_genres:
            score += 2

    # bônus por artista
    if post.artist:
        user_artists = set(
            a.id for a in post.artist.__class__.objects.filter(
                posts__votes__user=user
            )
        )
        if post.artist.id in user_artists:
            score += 3

    return score
