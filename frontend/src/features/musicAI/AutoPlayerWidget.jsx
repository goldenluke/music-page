import { useEffect, useState } from "react";
import { apiGet } from "./api";

export default function AutoPlayerWidget() {
  const [track, setTrack] = useState(null);

  async function next() {
    const data = await apiGet("/autoplay/next");
    setTrack(data);
  }

  useEffect(() => {
    next();
  }, []);

  if (!track) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs">{track.title}</p>

      <iframe
        src={track.embed_url}
        className="w-full h-[120px] rounded"
      />

      <button onClick={next} className="text-xs bg-green-600 p-1 rounded">
        Next
      </button>
    </div>
  );
}
