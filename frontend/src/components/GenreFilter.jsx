import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { Filter } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function GenreFilter({ activeGenre, onSelect }) {

  const { t } = useTranslation()

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.get('/genres').then(res => res.data),
                                        staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {

    function handleClickOutside(event) {

      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  const genres = Array.isArray(genresData) ? genresData : []

  const filtered = genres.filter(g =>
  g.name.toLowerCase().includes(query.toLowerCase())
  )

  return (

    <div ref={containerRef} className="relative w-full mb-8 max-w-xl">

    <div className="flex items-center gap-3 bg-white/80 dark:bg-[#0f1115] border border-white/10 rounded-2xl px-4 py-2 backdrop-blur">

    <Filter size={16} className="text-slate-500"/>

    <input
    type="text"
    placeholder={t("search_genre", "Buscar gênero")}
    value={query}
    onChange={(e)=>{
      setQuery(e.target.value)
      setOpen(true)
    }}
    onFocus={()=>setOpen(true)}
    className="bg-transparent outline-none flex-1 text-sm"
    />

    {activeGenre && (
      <button
      onClick={()=>{
        onSelect(null)
        setQuery("")
      }}
      className="text-xs text-green-500 font-bold"
      >
      clear
      </button>
    )}

    </div>

    {open && filtered.length > 0 && (

      <div className="absolute w-full mt-2 bg-white dark:bg-[#0f1115] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">

      {filtered.map((genre)=>(
        <button
        key={genre.id}
        onClick={()=>{
          onSelect(genre.slug)
          setQuery(genre.name)
          setOpen(false)
        }}
        className={`w-full text-left px-4 py-2 text-sm hover:bg-green-600/20 transition ${
          activeGenre === genre.slug ? "text-green-500 font-bold" : ""
        }`}
        >
        {genre.name}
        </button>
      ))}

      </div>

    )}

    </div>

  )

}
