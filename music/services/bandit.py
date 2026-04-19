import random
from django.db.models import F

EPSILON = 0.1


def get_model():
    from music.models import BanditArm
    return BanditArm


def get_key(post):
    return str(post.genre.id) if post.genre else "unknown"


def get_or_create_arm(key):
    BanditArm = get_model()
    arm, _ = BanditArm.objects.get_or_create(key=key)
    return arm


def update_bandit(post, reward):
    key = get_key(post)
    BanditArm = get_model()

    arm, _ = BanditArm.objects.get_or_create(key=key)

    BanditArm.objects.filter(pk=arm.pk).update(
        reward=F("reward") + reward,
        count=F("count") + 1
    )


def get_score(post):
    key = get_key(post)
    BanditArm = get_model()

    arm, _ = BanditArm.objects.get_or_create(key=key)

    reward = arm.reward
    count = arm.count

    return reward / count if count > 0 else 0


def choose(posts):
    if not posts:
        return []

    if random.random() < EPSILON:
        random.shuffle(posts)
        return posts

    scored = []

    for p in posts:
        score = get_score(p)
        scored.append((score, p))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [p for _, p in scored]
