import { useState } from "react";
import { apiGet } from "./api";

export default function MoodWidget() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  async function search() {
    const data = await apiGet(`/mood?q=${q}`);
    setResults(data);
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="dark techno, sad..."
        className="px-2 py-1 rounded bg-black/30 text-xs"
      />
      <button onClick={search} className="text-xs bg-green-600 p-1 rounded">
        Buscar
      </button>

      {results.map((r, i) => (
        <div key={i} className="text-xs text-slate-300">
          {r.title}
        </div>
      ))}
    </div>
  );
}
