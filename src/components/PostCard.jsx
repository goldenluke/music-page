import { useState } from "react";
import { apiFetch } from "../services/api";
import Comments from "./Comments";

export default function PostCard({ post, goToArtist }) {
  const [score, setScore] = useState(post.score);
  const [voted, setVoted] = useState(post.voted);
  const [showComments, setShowComments] = useState(false);

  const artistName = post.title.includes(" - ")
    ? post.title.split(" - ")[0]
    : null;

  const artistSlug = artistName
    ? artistName.toLowerCase().replace(/\s+/g, "-")
    : null;

  async function handleUpvote() {
    try {
      const data = await apiFetch(`/posts/${post.id}/upvote`, {
        method: "POST"
      });

      setScore(data.score);
      setVoted(data.voted);

    } catch (err) {
      console.error("Erro ao votar", err);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h3>{post.title}</h3>

      {artistName && (
        <button onClick={() => goToArtist(artistSlug)}>
          🎤 {artistName}
        </button>
      )}

      <button onClick={handleUpvote}>
        {voted ? "🔼 Votado" : "🔼 Upvote"}
      </button>

      <button onClick={() => setShowComments(!showComments)}>
        💬 Comentários
      </button>

      <p>Score: {score}</p>

      {post.embed_url && (
        <iframe src={post.embed_url} width="100%" height="200" />
      )}

      {showComments && <Comments postId={post.id} />}
    </div>
  );
}
