import { useEffect, useState } from "react";
import { apiGet } from "./api";

export default function PlaylistWidget() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await apiGet("/playlist/hybrid?q=techno");
    setList(data);
  }

  return (
    <div className="flex flex-col gap-2">
      {list.map((m, i) => (
        <div key={i} className="text-xs text-slate-300">
          {m.title}
        </div>
      ))}
    </div>
  );
}
