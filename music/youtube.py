import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def get_youtube_client():
    # Tenta pegar do ambiente
    api_key = os.getenv("YOUTUBE_API_KEY")
    
    if not api_key:
        print("❌ ERRO: YOUTUBE_API_KEY não encontrada no ambiente (os.getenv)")
        return None
        
    try:
        return build("youtube", "v3", developerKey=api_key)
    except Exception as e:
        print(f"❌ ERRO ao inicializar cliente Google: {e}")
        return None

def search_youtube(query, limit=5):
    youtube = get_youtube_client()
    if not youtube:
        return []
    
    try:
        req = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=limit,
            regionCode="BR"
        )
        res = req.execute()
        
        results = []
        for item in res.get("items", []):
            results.append({
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
            })
        
        print(f"✅ Busca YT concluída: {len(results)} resultados para '{query}'")
        return results

    except HttpError as e:
        print(f"❌ ERRO na API do YouTube: {e.content.decode()}")
        return []
    except Exception as e:
        print(f"❌ ERRO genérico no search_youtube: {e}")
        return []

def ingest_youtube(title, url, user):
    from .models import Post, Sub
    sub, _ = Sub.objects.get_or_create(slug="geral", defaults={"name": "Geral", "creator": user})
    post = Post.objects.create(title=title, url=url, author=user, sub=sub)
    post.save() 
    return post
