import { useEffect, useState } from "react";

export default function Player() {
  const [current, setCurrent] = useState(null);

  async function loadNext() {
    const res = await fetch("/api/autoplay/next");
    const data = await res.json();
    setCurrent(data);
  }

  useEffect(() => {
    loadNext();
  }, []);

  if (!current) return <div>Loading...</div>;

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

      <button onClick={loadNext}>
        Próxima ▶️
      </button>
    </div>
  );
}
