from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
import re
from django.utils.text import slugify


# -----------------------------
# Detectar artista no título
# -----------------------------

def detect_artist(title):

    if " - " in title:

        from .models import Artist

        artist_name = title.split(" - ")[0].strip()

        slug = slugify(artist_name)

        artist, _ = Artist.objects.get_or_create(
            slug=slug,
            defaults={"name": artist_name}
        )

        return artist

    return None

# -----------------------------
# Utilitário para gerar embed
# -----------------------------

def youtube_embed(url):
    pattern = r"(?:v=|youtu.be/)([A-Za-z0-9_-]+)"
    match = re.search(pattern, url)

    if match:
        video_id = match.group(1)
        return f"https://www.youtube.com/embed/{video_id}"

    return None


# -----------------------------
# Gênero musical
# -----------------------------

class Genre(models.Model):

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


# -----------------------------
# Comunidades (Subs)
# -----------------------------

class Sub(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    description = models.TextField(blank=True)

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_subs"
    )

    members = models.ManyToManyField(
        User,
        related_name="joined_subs",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"s/{self.slug}"


# -----------------------------
# Artist
# -----------------------------

class Artist(models.Model):

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    genres = models.ManyToManyField("Genre", blank=True)

    def __str__(self):
        return self.name

# -----------------------------
# Post principal
# -----------------------------

class Post(models.Model):

    title = models.CharField(max_length=200)

    url = models.URLField()

    embed_url = models.URLField(
        blank=True,
        null=True
    )

    provider = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    content = models.TextField(
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to="post_images/",
        blank=True,
        null=True
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    score = models.IntegerField(default=0)

    sub = models.ForeignKey(
        Sub,
        on_delete=models.CASCADE,
        related_name="posts",
        null=True
    )

    genre = models.ForeignKey(
        Genre,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )

    artist = models.ForeignKey(
        Artist,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        # detectar artista automaticamente
        if not self.artist:
            artist = detect_artist(self.title)
            if artist:
                self.artist = artist

        # detectar embeds
        if self.url:

            if "youtube.com" in self.url or "youtu.be" in self.url:
                self.provider = "youtube"
                self.embed_url = youtube_embed(self.url)

            elif "spotify.com" in self.url:
                self.provider = "spotify"
                self.embed_url = self.url.replace(
                    "open.spotify.com",
                    "open.spotify.com/embed"
                )

            elif "soundcloud.com" in self.url:
                self.provider = "soundcloud"
                self.embed_url = f"https://w.soundcloud.com/player/?url={self.url}"

        super().save(*args, **kwargs)

        # ligar artista ao gênero automaticamente
        if self.artist and self.genre:
            self.artist.genres.add(self.genre)

    def __str__(self):
        return self.title


# -----------------------------
# Votos
# -----------------------------

class Vote(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="votes"
    )

    class Meta:
        unique_together = ("user", "post")


# -----------------------------
# Comentários
# -----------------------------

class Comment(models.Model):

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)


# -----------------------------
# Biblioteca (posts salvos)
# -----------------------------

class SavedPost(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_posts"
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")


# -----------------------------
# Perfil (status online)
# -----------------------------

class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    last_seen = models.DateTimeField(default=timezone.now)


# -----------------------------
# Notificações
# -----------------------------

class Notification(models.Model):

    TYPES = (
        ("vote", "Vote"),
        ("comment", "Comment"),
    )

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    actor = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    notification_type = models.CharField(
        max_length=10,
        choices=TYPES
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)


# -----------------------------
# Criar Profile automaticamente
# -----------------------------

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
