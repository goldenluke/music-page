from collections import defaultdict

# pesos iniciais
weights = {
    "similarity": 0.6,
    "popularity": 0.2,
    "recency": 0.2
}

# histórico simples (em memória)
feedback_log = []

def update_weights(event_type):
    global weights

    reward = 0

    if event_type == "click":
        reward = 0.2
    elif event_type == "upvote":
        reward = 1.0
    elif event_type == "skip":
        reward = -0.3

    # ajuste simples (gradient-like)
    weights["similarity"] += 0.05 * reward
    weights["popularity"] += 0.02 * reward
    weights["recency"] += 0.01 * reward

    # normalizar
    total = sum(weights.values())
    for k in weights:
        weights[k] /= total

    feedback_log.append((event_type, dict(weights)))

def get_weights():
    return weights
