import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function AutoPlayer() {
  const [track, setTrack] = useState(null);

  async function next() {
    const data = await apiGet("/autoplay/next");
    setTrack(data);
  }

  useEffect(() => {
    next();
  }, []);

  if (!track) return <div>Loading...</div>;

  return (
    <div>
      <h2>▶️ Autoplay</h2>
      <p>{track.title}</p>

      <iframe
        src={track.embed_url}
        width="400"
        height="200"
        allow="autoplay"
      />

      <button onClick={next}>Próxima</button>
    </div>
  );
}
