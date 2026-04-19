from time import time

CACHE = {}
TTL = 60  # segundos

def get_cache(key):
    if key in CACHE:
        data, timestamp = CACHE[key]

        if time() - timestamp < TTL:
            return data

        del CACHE[key]

    return None

def set_cache(key, value):
    CACHE[key] = (value, time())
