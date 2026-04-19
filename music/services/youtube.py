import requests
import os

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def search_youtube(query):
    if not YOUTUBE_API_KEY:
        print("❌ YOUTUBE API KEY AUSENTE")
        return []

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 10,
        "key": YOUTUBE_API_KEY
    }

    res = requests.get(url, params=params)

    if res.status_code != 200:
        print("❌ YT ERROR:", res.text)
        return []

    data = res.json()

    results = []

    for item in data.get("items", []):
        snippet = item["snippet"]

        results.append({
            "title": snippet["title"],
            "channel": snippet["channelTitle"],
            "thumbnail": snippet["thumbnails"]["medium"]["url"]
        })

    return results
