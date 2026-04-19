import { useState } from "react";
import { useComments } from "../hooks/useComments";

export default function Comments({ postId }) {
  const { comments, refresh } = useComments(postId);
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      setText("");
      refresh();

    } catch (err) {
      console.error("Erro ao comentar", err);
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h4>Comentários</h4>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Escreva um comentário..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Comentar</button>
      </form>

      {comments.map(c => (
        <div key={c.id} style={{ borderTop: "1px solid #ccc", marginTop: 10 }}>
          <p><b>{c.author_username}</b></p>
          <p>{c.text}</p>
          <small>{c.created_at}</small>
        </div>
      ))}
    </div>
  );
}
