from django.db.models import Count, Avg, FloatField, Sum
from django.db.models.functions import Cast, Coalesce
from django.db.models.fields.json import KeyTextTransform
from django.utils import timezone
from datetime import timedelta
from .models import UserEvent, Post, User
from collections import Counter

def get_comprehensive_metrics(days=7):
    start_date = timezone.now() - timedelta(days=days)
    
    # 1. Atividade Diária
    events = UserEvent.objects.filter(created_at__gte=start_date)
    daily_activity = list(
        events.extra(select={'day': "date(created_at)"})
        .values('day')
        .annotate(count=Count('id'))
        .order_by('day')
    )

    # 2. DNA Sônico
    def get_avg_feature(feature_name):
        return Avg(Cast(KeyTextTransform(feature_name, 'audio_features'), FloatField()))

    audio_dna_raw = Post.objects.filter(audio_features__isnull=False).aggregate(
        energy=get_avg_feature('energy'),
        danceability=get_avg_feature('danceability'),
        valence=get_avg_feature('valence'),
        speechiness=get_avg_feature('speechiness'),
        acousticness=get_avg_feature('acousticness')
    )
    audio_dna = {k: (v or 0) for k, v in audio_dna_raw.items()}

    # 3. Gêneros
    all_tags = []
    for p in Post.objects.filter(created_at__gte=start_date).exclude(semantic_data__tags=[]):
        all_tags.extend(p.semantic_data.get('tags', []))
    genre_dist = dict(Counter(all_tags).most_common(10))

    # 4. Scouts
    top_scouts = list(
        User.objects.annotate(total_score=Coalesce(Sum('post__score'), 0))
        .order_by('-total_score')[:5]
        .values('username', 'total_score')
    )

    return {
        "daily_activity": daily_activity,
        "audio_dna": audio_dna,
        "genre_dist": genre_dist,
        "top_scouts": top_scouts,
        "total_catalog": Post.objects.count(),
        "period_events": events.count()
    }
