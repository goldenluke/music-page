import random

def assign_variant(user):
    # simples: hash do id
    return "A" if user.id % 2 == 0 else "B"
