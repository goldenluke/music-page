import { useState } from "react";
import { useMeta } from "../hooks/useMeta";

export default function CreatePost() {
  const { subs, genres } = useMeta();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subId, setSubId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("sub_id", subId);
    if (genreId) formData.append("genre_id", genreId);
    if (image) formData.append("image", image);

    try {
      await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      alert("Post criado 🚀");
      window.location.reload();

    } catch (err) {
      console.error("Erro ao criar post", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Post</h2>

      <input
        placeholder="Título (ex: Artist - Música)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="URL (YouTube, Spotify...)"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <select onChange={e => setSubId(e.target.value)} required>
        <option value="">Escolha uma comunidade</option>
        {subs.map(s => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select onChange={e => setGenreId(e.target.value)}>
        <option value="">Gênero (opcional)</option>
        {genres.map(g => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        onChange={e => setImage(e.target.files[0])}
      />

      <button type="submit">Postar</button>
    </form>
  );
}
