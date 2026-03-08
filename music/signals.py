from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment, Vote, Notification

@receiver(post_save, sender=Comment)
def notify_comment(sender, instance, created, **kwargs):
    # Notifica apenas se for um comentário novo e não for do próprio autor
    if created and instance.author != instance.post.author:
        Notification.objects.create(
            recipient=instance.post.author,
            actor=instance.author,
            notification_type='comment',
            post=instance.post
        )

@receiver(post_save, sender=Vote)
def notify_vote(sender, instance, created, **kwargs):
    # Notifica apenas votos novos (upvotes)
    if created and instance.user != instance.post.author:
        Notification.objects.create(
            recipient=instance.post.author,
            actor=instance.user,
            notification_type='vote',
            post=instance.post
        )