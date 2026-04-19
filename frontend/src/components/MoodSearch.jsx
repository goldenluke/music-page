import { useState } from "react";
import { apiGet } from "../api/api";

export default function MoodSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  async function search() {
    if (!q.trim()) return; const data = await apiGet(`/mood?q=${q}`);
    setResults(data);
  }

  return (
    <div>
      <h2>🧠 Mood Search</h2>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ex: dark techno, triste lento..."
      />

      <button onClick={search}>Buscar</button>

      {results.map((r, i) => (
        <div key={i}>
          <p>{r.title}</p>
          <iframe src={r.embed_url} width="300" height="150" />
        </div>
      ))}
    </div>
  );
}
