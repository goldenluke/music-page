import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const data = await apiFetch("/posts?sort=latest&limit=10");
      setPosts(data);
    } catch (err) {
      console.error("Erro ao carregar posts", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, refresh: fetchPosts };
}
