import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

export default function CreatePost() {

  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [genre, setGenre] = useState("")
  const [sub, setSub] = useState("")

  const { data: genresData = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => axios.get("/genres").then(res => res.data)
  })

  const { data: subsData = [] } = useQuery({
    queryKey: ["subs"],
    queryFn: () => axios.get("/subs").then(res => res.data)
  })

  const genres = Array.isArray(genresData) ? genresData : []
  const subs = Array.isArray(subsData) ? subsData : []

  const createMutation = useMutation({

    mutationFn: (formData) => axios.post("/posts", formData),

                                     onSuccess: () => {

                                       queryClient.invalidateQueries(["posts"])

                                       setTitle("")
                                       setUrl("")
                                       setContent("")
                                       setImage(null)
                                       setGenre("")
                                       setSub("")

                                     }

  })

  const handleSubmit = (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("title", title)
      formData.append("url", url)
        formData.append("content", content)

          if (genre) formData.append("genre", genre)
            if (sub) formData.append("sub", sub)

              if (image) formData.append("image", image)

                createMutation.mutate(formData)

  }

  return (

    <div className="bg-white/80 dark:bg-[#0f1115] border border-white/10 rounded-2xl p-6 mb-10">

    <h3 className="font-black text-lg mb-4">

    🎧 {t("create_post", "Compartilhar música")}

    </h3>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

    {/* título */}

    <input
    type="text"
    placeholder="Aphex Twin - Windowlicker"
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
    required
    className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-white/10"
    />

    {/* url */}

    <input
    type="url"
    placeholder="YouTube / Spotify / SoundCloud URL"
    value={url}
    onChange={(e)=>setUrl(e.target.value)}
    required
    className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-white/10"
    />

    {/* conteúdo */}

    <textarea
    placeholder="Comentário (opcional)"
    value={content}
    onChange={(e)=>setContent(e.target.value)}
    className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-white/10"
    />

    {/* gênero */}

    <select
    value={genre}
    onChange={(e)=>setGenre(e.target.value)}
    className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-white/10"
    >

    <option value="">
    {t("genre", "Gênero")}
    </option>

    {genres.map(g => (

      <option key={g.id} value={g.id}>

      {g.name}

      </option>

    ))}

    </select>

    {/* comunidade */}

    <select
    value={sub}
    onChange={(e)=>setSub(e.target.value)}
    className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-white/10"
    >

    <option value="">
    {t("community", "Comunidade")}
    </option>

    {subs.map(s => (

      <option key={s.id} value={s.id}>

      s/{s.slug}

      </option>

    ))}

    </select>

    {/* imagem */}

    <input
    type="file"
    onChange={(e)=>setImage(e.target.files[0])}
    className="text-sm"
    />

    {/* botão */}

    <button
    type="submit"
    disabled={createMutation.isPending}
    className="bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
    >

    {createMutation.isPending
      ? t("posting","Postando...")
      : t("post","Postar")
    }

    </button>

    </form>

    </div>

  )

}
