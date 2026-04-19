from django.utils import timezone
from datetime import timedelta

def trending_score(post):
    age_hours = (timezone.now() - post.created_at).total_seconds() / 3600
    return post.score / pow((age_hours + 2), 1.5)
