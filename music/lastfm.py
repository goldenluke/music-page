import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("LASTFM_API_KEY")
BASE_URL = "http://ws.audioscrobbler.com/2.0/"

def get_enriched_metadata(artist_name, track_name):
    """Busca tags, resumo e similaridade no Last.fm"""
    if not API_KEY: return None
    
    params = {
        "method": "track.getInfo",
        "api_key": API_KEY,
        "artist": artist_name,
        "track": track_name,
        "format": "json",
        "autocorrect": 1
    }
    
    try:
        res = requests.get(BASE_URL, params=params)
        data = res.json()
        
        if "track" not in data: return None
        
        track = data["track"]
        return {
            "tags": [t["name"].lower() for t in track.get("toptags", {}).get("tag", [])],
            "listeners": track.get("listeners"),
            "playcount": track.get("playcount"),
            "summary": track.get("wiki", {}).get("summary", ""),
            "duration": track.get("duration")
        }
    except:
        return None
