from googleapiclient.discovery import build
import os

def get_youtube_client():
    """Inicializa o cliente apenas quando necessário para evitar erros de credenciais no startup"""
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        # Apenas um aviso no console, não trava o servidor
        # print("⚠️ Aviso: YOUTUBE_API_KEY não encontrada no ambiente.")
        return None
    try:
        return build("youtube", "v3", developerKey=api_key)
    except Exception as e:
        print(f"❌ Erro ao conectar na API do YouTube: {e}")
        return None

def search_youtube(query, limit=10):
    youtube = get_youtube_client()
    if not youtube:
        return []

    req = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=limit
    )

    res = req.execute()
    results = []

    for item in res.get("items", []):
        video_id = item["id"]["videoId"]
        snippet = item["snippet"]

        results.append({
            "title": snippet["title"],
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "thumbnail": snippet["thumbnails"]["high"]["url"]
        })

    return results

def ingest_youtube(query):
    """
    Função exigida pelo api.py.
    Implementação básica para satisfazer o import.
    """
    print(f"🚀 Iniciando ingestão para: {query}")
    results = search_youtube(query, limit=5)
    # Aqui você poderia salvar no banco de dados futuramente
    return {"status": "success", "count": len(results), "items": results}
