import numpy as np

# =========================
# MOCK EMBEDDING (LLAMA FUTURO)
# =========================
def get_embedding(text):
    if not text:
        return []

    # fake embedding (substituir depois pelo LLaMA real)
    return np.random.rand(4096)

# compatibilidade
embed_text = get_embedding

# =========================
# SIMILARIDADE
# =========================
def cosine_similarity(a, b):
    if a is None or b is None:
        return 0

    if len(a) == 0 or len(b) == 0:
        return 0

    if len(a) != len(b):
        return 0

    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
