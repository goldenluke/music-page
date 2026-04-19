from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
import re
from django.utils.text import slugify
from .semantic import build_semantic_data

def get_media_info(url):
    info = {'embed': None, 'thumbnail': None}
    # YouTube
    yt_match = re.search(r"(?:v=|youtu\.be/|embed/)([A-Za-z0-9_-]{11})", url)
    if yt_match:
        video_id = yt_match.group(1)
        info['embed'] = f"https://www.youtube.com/embed/{video_id}"
        info['thumbnail'] = f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg"
        return info
    # Spotify
    spot_match = re.search(r"open\.spotify\.com/(track|album|playlist)/([A-Za-z0-9]+)", url)
    if spot_match:
        stype, sid = spot_match.groups()
        info['embed'] = f"https://open.spotify.com/embed/{stype}/{sid}"
        return info
    return info

class Genre(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    def __str__(self): return self.name

class Sub(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_subs")
    members = models.ManyToManyField(User, related_name="joined_subs", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"s/{self.slug}"

class Artist(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    genres = models.ManyToManyField("Genre", blank=True)
    def __str__(self): return self.name

class Post(models.Model):
    search_vector = models.TextField(null=True, blank=True)
    semantic_data = models.JSONField(default=dict, blank=True)
    embedding = models.JSONField(null=True, blank=True)
    audio_features = models.JSONField(null=True, blank=True)
    title = models.CharField(max_length=200)
    url = models.URLField()
    embed_url = models.URLField(blank=True, null=True)
    thumbnail = models.URLField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="post_images/", blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    sub = models.ForeignKey(Sub, on_delete=models.CASCADE, related_name="posts", null=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    artist = models.ForeignKey(Artist, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        media = get_media_info(self.url)
        if not self.embed_url: self.embed_url = media['embed']
        if not self.thumbnail: self.thumbnail = media['thumbnail']
        self.semantic_data = build_semantic_data(self)
        super().save(*args, **kwargs)

    def __str__(self): return self.title

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="votes")
    class Meta: unique_together = ("user", "post")

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class SavedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_posts")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: unique_together = ("user", "post")

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    last_seen = models.DateTimeField(default=timezone.now)

class Notification(models.Model):
    TYPES = (("vote", "Vote"), ("comment", "Comment"))
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    actor = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=10, choices=TYPES)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created: Profile.objects.create(user=instance)

class UserEvent(models.Model):
    TYPES = (("view", "View"), ("click", "Click"), ("upvote", "Upvote"))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=10, choices=TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
