import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function PlaylistWidget() {
  const [list, setList] = useState([])

  useEffect(() => {
    api.get("/playlist/hybrid?q=techno")
      .then(res => setList(res.data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-3">
      {list.map((m, i) => (
        <div key={i} className="flex gap-3 items-center">
          <img
            src={m.thumbnail || "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="text-xs">
            <div className="font-bold">{m.title}</div>
            <div className="text-slate-500">{m.source}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
