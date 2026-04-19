import { useState } from "react"
import axios from "axios"

export default function GraphExplorer() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)

    try {
      const res = await axios.get(`/graph?node=${query}`)
      setData(res.data)
    } catch (err) {
      console.error("graph error", err)
      setData(null)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white/50 dark:bg-[#0f1115] p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">

      <h4 className="text-[10px] font-black mb-4 text-green-500 uppercase tracking-widest">
        🌐 Graph Explorer
      </h4>

      {/* INPUT */}
      <div className="flex items-center gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: techno"
          className="flex-1 h-10 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-600 outline-none text-sm"
        />
        <button
          onClick={handleSearch}
          className="h-10 px-4 bg-green-600 rounded-xl text-white text-xs font-bold flex items-center justify-center"
        >
          Explorar
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-xs text-green-500">
          Carregando grafo...
        </div>
      )}

      {/* RESULTADO */}
      {data && (
        <div className="text-xs text-slate-400 space-y-1 max-h-40 overflow-y-auto">
          {data.nodes?.map((n, i) => (
            <div key={i}>
              {n.name} ({n.weight})
            </div>
          ))}
        </div>
      )}

      {!loading && !data && (
        <div className="text-xs text-slate-500">
          Explore conexões musicais
        </div>
      )}
    </div>
  )
}
