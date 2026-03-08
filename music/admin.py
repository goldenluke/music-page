from django.contrib import admin
from .models import Post, Genre, Sub, Vote, Comment, SavedPost, Profile, Notification

@admin.register(Sub)
class SubAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'creator', 'created_at')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Post)
admin.site.register(Vote)
admin.site.register(Comment)
admin.site.register(Profile)
admin.site.register(Notification)