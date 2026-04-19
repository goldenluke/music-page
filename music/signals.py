from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserEvent
from .services.bandit import update_bandit

@receiver(post_save, sender=UserEvent)
def bandit_feedback(sender, instance, created, **kwargs):
    if not created:
        return

    reward_map = {
        "click": 1,
        "upvote": 2,
        "skip": -0.5
    }

    reward = reward_map.get(instance.event_type, 0)

    update_bandit(instance.post, reward)
