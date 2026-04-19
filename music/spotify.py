import requests
import base64
import os

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_token():
    auth = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

    res = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={"Authorization": f"Basic {auth}"},
        data={"grant_type": "client_credentials"}
    )

    return res.json()["access_token"]

def search_spotify(query, limit=10):
    token = get_token()

    res = requests.get(
        "https://api.spotify.com/v1/search",
        headers={"Authorization": f"Bearer {token}"},
        params={"q": query, "type": "track", "limit": limit}
    )

    data = res.json()

    tracks = []

    for t in data.get("tracks", {}).get("items", []):

        tracks.append({
            "title": f"{t['name']} - {t['artists'][0]['name']}",
            "embed_url": f"https://open.spotify.com/embed/track/{t['id']}",

            # 🔥 THUMB
            "thumbnail": t["album"]["images"][0]["url"]
        })

    return tracks
