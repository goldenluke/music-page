import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function HybridPlaylist() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await apiGet("/playlist/hybrid?q=techno");
    setList(data);
  }

  return (
    <div>
      <h2>🔥 Playlist IA</h2>

      {list.map((m, i) => (
        <div key={i}>
          <p>{m.title}</p>
          <iframe src={m.embed_url} width="300" height="150" />
        </div>
      ))}
    </div>
  );
}
