import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("LASTFM_API_KEY")

BASE_URL = "http://ws.audioscrobbler.com/2.0/"

def get_track_tags(artist, track):
    params = {
        "method": "track.getTopTags",
        "artist": artist,
        "track": track,
        "api_key": API_KEY,
        "format": "json"
    }

    res = requests.get(BASE_URL, params=params)
    data = res.json()

    return [t["name"] for t in data.get("toptags", {}).get("tag", [])]


def get_artist_tags(artist):
    params = {
        "method": "artist.getTopTags",
        "artist": artist,
        "api_key": API_KEY,
        "format": "json"
    }

    res = requests.get(BASE_URL, params=params)
    data = res.json()

    return [t["name"] for t in data.get("toptags", {}).get("tag", [])]
