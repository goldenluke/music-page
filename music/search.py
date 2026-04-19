from django.db import connection

def search_posts(query):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                id,
                title,

                -- ranking full-text
                ts_rank(
                    to_tsvector('english', search_vector),
                    plainto_tsquery('english', %s)
                )

                -- fuzzy similarity
                + similarity(title, %s) * 0.5

                -- peso por popularidade (clicks/upvotes)
                + COALESCE(score, 0) * 0.1

                AS rank_score

            FROM music_post

            WHERE
                to_tsvector('english', search_vector)
                @@ plainto_tsquery('english', %s)

                OR similarity(title, %s) > 0.2

            ORDER BY rank_score DESC
            LIMIT 20;
        """, [query, query, query, query])

        rows = cursor.fetchall()

    return [{"id": r[0], "title": r[1], "score": float(r[2])} for r in rows]


# =========================
# AUTOCOMPLETE
# =========================
def autocomplete(query):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT title
            FROM music_post
            WHERE title ILIKE %s
            ORDER BY similarity(title, %s) DESC
            LIMIT 5;
        """, [query + "%", query])

        return [r[0] for r in cursor.fetchall()]
