from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from music.models import Post, Genre, Sub
import random


posts = [

("Aphex Twin - Windowlicker","https://youtu.be/UBS4Gi1y_nc","idm"),
("Boards of Canada - Roygbiv","https://youtu.be/CMRLlSPt7ak","idm"),
("Daft Punk - Around the World","https://youtu.be/K0HSD_i2DvA","electronic"),
("Radiohead - Everything In Its Right Place","https://youtu.be/onRk0sjSgFU","alternative"),
("Massive Attack - Teardrop","https://youtu.be/u7K72X4eo_s","trip-hop"),
("Burial - Archangel","https://youtu.be/Et5B-zfAIIo","dubstep"),
("Squarepusher - My Red Hot Car","https://youtu.be/3Q3p6E0KQxE","idm"),
("Flying Lotus - Zodiac Shit","https://youtu.be/0ScYz9sNaQk","electronic"),
("Nujabes - Feather","https://youtu.be/M-BWXT3UBns","hip-hop"),
("J Dilla - Workinonit","https://youtu.be/1uCPDHzm_DM","hip-hop"),

("Four Tet - Two Thousand and Seventeen","https://youtu.be/2jJ9oH8m2y0","electronic"),
("Autechre - Gantz Graf","https://youtu.be/ev3vENli7wQ","idm"),
("Brian Eno - An Ending","https://youtu.be/OlaTeXX3uH8","ambient"),
("Portishead - Roads","https://youtu.be/7nxWP9BhI7w","trip-hop"),
("The Prodigy - Firestarter","https://youtu.be/wmin5WkOuPw","electronic"),
("DJ Shadow - Midnight In A Perfect World","https://youtu.be/InFbBlpDTfQ","hip-hop"),
("Bonobo - Kerala","https://youtu.be/S0Q4gqBUs7c","electronic"),
("Thom Yorke - The Eraser","https://youtu.be/o9FZQn0vF5A","alternative"),
("Tycho - Awake","https://youtu.be/xOrcb0Uo48c","ambient"),
("Kraftwerk - The Robots","https://youtu.be/D_8Pma1vHmw","electronic"),

]


subs = [
"electronic",
"idm",
"hiphop",
"ambient",
"rock",
"triphop"
]


class Command(BaseCommand):

    help = "Seed MusicaBR with music posts"


    def handle(self, *args, **kwargs):

        self.stdout.write("Criando usuário bot...")

        user, _ = User.objects.get_or_create(
            username="musicbot",
            defaults={"email": "bot@musicabr.local"}
        )

        self.stdout.write("Criando comunidades...")

        sub_objs = {}

        for s in subs:

            sub, _ = Sub.objects.get_or_create(

                slug=s,

                defaults={
                    "name": s,
                    "creator": user
                }

            )

            sub.members.add(user)

            sub_objs[s] = sub


        self.stdout.write("Criando posts...")

        created = 0

        for i in range(30):   # multiplica os posts

            for title, url, genre in posts:

                genre_obj, _ = Genre.objects.get_or_create(

                    slug=genre,
                    defaults={"name": genre}

                )

                Post.objects.create(

                    title=title,
                    url=url,
                    author=user,
                    genre=genre_obj,
                    sub=random.choice(list(sub_objs.values()))

                )

                created += 1


        self.stdout.write(

            self.style.SUCCESS(
                f"{created} posts criados com sucesso!"
            )

        )
