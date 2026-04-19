import { useState } from "react"
import axios from "axios"

export default function YoutubeIngest() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)

    try {
      const res = await axios.get(`/youtube/search?q=${query}`)
      setResults(res.data)
    } catch (err) {
      console.error("YT search error", err)
    }

    setLoading(false)
  }

  const handleImport = async (video) => {
    try {
      await axios.post("/ingest", {
        title: video.title,
        artist: video.channel,
        genre: "unknown",
        sub: "youtube"
      })

      alert("Importado 🚀")
    } catch (err) {
      console.error("ingest error", err)
      alert("Erro ao importar")
    }
  }

  return (
    <div className="bg-white/50 dark:bg-[#0f1115] p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
      
      <h4 className="text-[10px] font-black mb-4 text-green-500 uppercase tracking-widest">
        🎬 Importador Rápido
      </h4>

      {/* INPUT */}
      <div className="flex items-center gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar no YouTube..."
          className="flex-1 h-10 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-600 outline-none text-sm"
        />
        <button
          onClick={handleSearch}
          className="h-10 px-4 bg-green-600 rounded-xl text-white text-xs font-bold flex items-center justify-center"
        >
          Buscar
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="text-xs text-green-500">Buscando...</div>}

      {/* RESULTADOS */}
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
        {results.map((v, i) => (
          <div
            key={i}
            className="flex gap-3 items-center p-2 rounded-xl hover:bg-green-600/10 transition"
          >
            <img
              src={v.thumbnail}
              alt=""
              className="w-16 h-10 object-cover rounded"
            />

            <div className="flex-1">
              <div className="text-xs font-bold line-clamp-2">
                {v.title}
              </div>
              <div className="text-[10px] text-slate-400">
                {v.channel}
              </div>
            </div>

            <button
              onClick={() => handleImport(v)}
              className="text-[10px] bg-green-600 text-white px-2 py-1 rounded"
            >
              Importar
            </button>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <div className="text-xs text-slate-400">
            Nenhum resultado
          </div>
        )}
      </div>
    </div>
  )
}
