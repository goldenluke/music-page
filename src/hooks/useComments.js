import { useEffect, useState } from "react";

export function useComments(postId) {
  const [comments, setComments] = useState([]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Erro ao carregar comentários", err);
    }
  }

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  return { comments, refresh: fetchComments };
}
