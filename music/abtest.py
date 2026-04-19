import random

def assign_group(user):
    random.seed(user.id)
    return "A" if random.random() < 0.5 else "B"
