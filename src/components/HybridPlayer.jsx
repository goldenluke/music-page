import { useEffect, useState } from "react";

export default function HybridPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);

  async function load() {
    const res = await fetch("/api/playlist/hybrid?q=lofi");
    const data = await res.json();
    setPlaylist(data);
  }

  useEffect(() => {
    load();
  }, []);

  if (!playlist.length) return <div>Loading...</div>;

  const current = playlist[index];

  function next() {
    setIndex((i) => (i + 1) % playlist.length);
  }

  return (
    <div>
      <h3>{current.title}</h3>

      <iframe
        width="100%"
        height="300"
        src={current.embed_url}
        title="player"
        allow="autoplay"
      />

      <button onClick={next}>
        Próxima ▶️
      </button>
    </div>
  );
}
