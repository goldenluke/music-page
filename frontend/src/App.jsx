import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import axios from "axios"

import MusicCard from "./components/MusicCard"
import CreatePost from "./components/CreatePost"
import GenreFilter from "./components/GenreFilter"
import SkeletonCard from "./components/SkeletonCard"
import NotificationsDropdown from "./components/NotificationsDropdown"

import {
  Music,
  Bell,
  Search,
  LogOut,
  Compass,
  Zap,
  X,
  Loader2,
  Hash,
  Plus,
  Send
} from "lucide-react"

axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true

function App() {

  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { subSlug } = useParams()
  const { ref, inView } = useInView()

  const [authMode, setAuthMode] = useState(null)
  const [showCreateSub, setShowCreateSub] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [user, setUser] = useState(null)
  const [sort, setSort] = useState("latest")
  const [search, setSearch] = useState("")
  const [subSearch, setSubSearch] = useState("")
  const [activeGenre, setActiveGenre] = useState(null)

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

  useEffect(() => {

    document.documentElement.classList.remove("dark","light")
    document.documentElement.classList.add(theme)

    localStorage.setItem("theme", theme)

  }, [theme])

  useEffect(() => {

    axios.get("/me")
    .then(res => setUser(res.data))
    .catch(() => setUser(null))

  }, [])

  const handleLogout = async () => {

    await axios.post("/logout")
    setUser(null)
    queryClient.invalidateQueries()

  }

  const handleAuth = async (e) => {

    e.preventDefault()

    const endpoint = authMode === "login" ? "/login" : "/register"

    const payload = {

      username: e.target.username.value,
      password: e.target.password.value,
      ...(authMode === "signup" && { email: e.target.email.value })

    }

    try {

      const res = await axios.post(endpoint, payload)
      setUser(res.data)
      setAuthMode(null)
      queryClient.invalidateQueries()

    }

    catch(err){

      alert(err.response?.data?.detail)

    }

  }

  const { data: notificationsData = [] } = useQuery({

    queryKey:["notifications"],
    queryFn:()=>axios.get("/notifications").then(res=>res.data),
                                                    enabled:!!user,
                                                    refetchInterval:15000

  })

  const notifications = Array.isArray(notificationsData) ? notificationsData : []
  const unreadCount = notifications.filter(n=>!n.is_read).length

  const { data: stats } = useQuery({

    queryKey:["stats"],
    queryFn:()=>axios.get("/stats").then(res=>res.data),
                                   refetchInterval:30000

  })

  const { data: allSubsData = [] } = useQuery({

    queryKey:["subs"],
    queryFn:()=>axios.get("/subs").then(res=>res.data)

  })

  const allSubs = Array.isArray(allSubsData) ? allSubsData : []

  const filteredSubs = allSubs.filter(sub =>
  sub.slug.toLowerCase().includes(subSearch.toLowerCase())
  )

  const { data: subData } = useQuery({

    queryKey:["sub", subSlug],
    queryFn:()=>axios.get(`/subs/${subSlug}`).then(res=>res.data),
                                     enabled:!!subSlug

  })

  const {

    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading

  } = useInfiniteQuery({

    queryKey:["posts", sort, search, activeGenre, subSlug],

    queryFn:({pageParam=0})=>

    axios.get("/posts",{

      params:{

        sort,
        search,
        genre:activeGenre,
        sub_slug:subSlug,
        limit:10,
        offset:pageParam

      }

    }).then(res=>res.data),

                       getNextPageParam:(lastPage)=>lastPage?.length===10 ? true : undefined,
                       initialPageParam:0

  })

  useEffect(()=>{

    if(inView && hasNextPage) fetchNextPage()

  },[inView,hasNextPage])

  const allPosts = useMemo(()=>postsData?.pages?.flat() || [],[postsData])

  const createSubMutation = useMutation({

    mutationFn:(newSub)=>axios.post("/subs",newSub),

                                        onSuccess:(res)=>{

                                          queryClient.invalidateQueries(["subs"])
                                          setShowCreateSub(false)
                                          navigate(`/s/${res.data.slug}`)

                                        }

  })

  const joinMutation = useMutation({

    mutationFn:()=>axios.post(`/subs/${subSlug}/join`),
                                   onSuccess:()=>queryClient.invalidateQueries(["sub",subSlug])

  })

  return (

    <div className="min-h-screen bg-musica text-black dark:text-white font-sans">

    {/* NAVBAR */}

    <nav className="border-b border-black/10 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-[100]">

    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

    <Link to="/" className="flex items-center gap-3">

    <div className="w-10 h-10 bg-green-600 rounded-2xl rotate-12 flex items-center justify-center">

    <Music className="text-white -rotate-12"/>

    </div>

    <h1 className="text-xl font-black italic">MusicaBR</h1>

    </Link>

    <div className="flex gap-4 items-center">

    <button

    onClick={()=>i18n.changeLanguage(i18n.language.startsWith("pt") ? "en" : "pt")}

    className="text-xs font-bold"

    >

    {i18n.language}

    </button>

    <button

    onClick={()=>setTheme(theme==="dark" ? "light" : "dark")}

    className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center"

    >

    {theme==="dark" ? "☀️":"🌙"}

    </button>

    {user ? (

      <>

      <button

      onClick={()=>setShowNotifs(!showNotifs)}

      className="relative"

      >

      <Bell/>

      {unreadCount>0 && (

        <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full">

        {unreadCount}

        </span>

      )}

      </button>

      {showNotifs && <NotificationsDropdown notifications={notifications}/>}

      <button onClick={handleLogout}><LogOut/></button>

      </>

    ):(

      <button

      onClick={()=>setAuthMode("login")}

      className="bg-green-600 px-4 py-2 rounded-xl text-white text-xs font-bold"

      >

      Login

      </button>

    )}

    </div>

    </div>

    </nav>

    {/* CONTEÚDO */}

    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">

    {/* SIDEBAR */}

    <aside className="hidden lg:block">

    <div className="flex items-center justify-between mb-4">

    <h3 className="text-xs font-black text-slate-500">
    {t("communities")}
    </h3>

    <button
    onClick={()=>setShowCreateSub(true)}
    className="text-green-600 hover:bg-green-600/10 p-1 rounded"
    >
    <Plus size={16}/>
    </button>

    </div>

    <input
    type="text"
    placeholder="Buscar comunidade"
    value={subSearch}
    onChange={(e)=>setSubSearch(e.target.value)}
    className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 dark:bg-[#0f1115] border border-white/10 text-sm"
    />

    <nav className="flex flex-col gap-2">

    <Link to="/" className="flex items-center gap-2 text-sm">
    <Compass size={16}/> Feed
    </Link>

    {filteredSubs.map(sub => (

      <Link
      key={sub.slug}
      to={`/s/${sub.slug}`}
      className="flex items-center gap-2 text-sm hover:text-green-600"
      >

      <Hash size={16}/> s/{sub.slug}

      </Link>

    ))}

    </nav>

    </aside>



    {/* FEED */}

    <main>
    {/* CRIAR POST */}

    {user && (

      <div className="mb-8">

      <CreatePost />

      </div>

    )}
    <div className="flex gap-3 mb-6 flex-wrap">

    <button

    onClick={()=>setSort("latest")}

    className={`px-4 py-2 rounded-xl text-xs font-black ${sort==="latest"?"bg-green-600 text-white":"bg-white/5"}`}

    >

    New

    </button>

    <button

    onClick={()=>setSort("top")}

    className={`px-4 py-2 rounded-xl text-xs font-black ${sort==="top"?"bg-green-600 text-white":"bg-white/5"}`}

    >

    Top

    </button>

    <button

    onClick={()=>setSort("trending")}

    className={`px-4 py-2 rounded-xl text-xs font-black ${sort==="trending"?"bg-green-600 text-white":"bg-white/5"}`}

    >

    Trending

    </button>

    </div>

    <GenreFilter activeGenre={activeGenre} onSelect={setActiveGenre}/>

    <div className="flex flex-col gap-6 min-w-0 w-full">

    {isLoading ? (

      [1,2,3].map(i=><SkeletonCard key={i}/>)

    ):(

    <>

    {allPosts.map(post=>(

      <MusicCard key={post.id} post={post} user={user}/>

    ))}

    <div ref={ref} className="py-20 flex justify-center">

    {isFetchingNextPage ?

      <Loader2 className="animate-spin text-green-500"/>

      :

      <Zap className="opacity-20"/>

    }

    </div>

    </>

    )}

    </div>

    </main>

    </div>

    {/* MODAL CRIAR COMUNIDADE */}

    {showCreateSub && (

      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-[#0f1115] p-8 rounded-2xl w-full max-w-sm">

      <h2 className="text-xl font-black mb-6">
      Criar comunidade
      </h2>

      <form
      onSubmit={(e)=>{
        e.preventDefault()
        createSubMutation.mutate({
          name:e.target.name.value,
          description:e.target.description.value
        })
      }}
      className="flex flex-col gap-4"
      >

      <input
      name="name"
      placeholder="Nome da comunidade"
      required
      className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
      />

      <textarea
      name="description"
      placeholder="Descrição"
      className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
      />

      <button
      type="submit"
      className="bg-green-600 text-white p-3 rounded-xl font-bold"
      >
      Criar
      </button>

      <button
      type="button"
      onClick={()=>setShowCreateSub(false)}
      className="text-sm text-slate-500"
      >
      Cancelar
      </button>

      </form>

      </div>

      </div>

    )}

    {/* MODAL LOGIN */}

    {authMode && (

      <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">

      <div className="bg-white dark:bg-[#0f1115] p-8 rounded-2xl w-full max-w-sm relative">

      <button
      onClick={()=>setAuthMode(null)}
      className="absolute top-3 right-3"
      >
      <X size={18}/>
      </button>

      <h2 className="text-xl font-black mb-6 text-center">

      {authMode==="login" ? "Login" : "Criar conta"}

      </h2>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">

      <input
      name="username"
      placeholder="username"
      required
      className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
      />

      {authMode==="signup" && (

        <input
        name="email"
        type="email"
        placeholder="email"
        required
        className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
        />

      )}

      <input
      name="password"
      type="password"
      placeholder="password"
      required
      className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
      />

      <button
      type="submit"
      className="bg-green-600 text-white p-3 rounded-xl font-bold"
      >
      {authMode==="login" ? "Login" : "Criar conta"}
      </button>

      <button
      type="button"
      onClick={()=>setAuthMode(authMode==="login"?"signup":"login")}
      className="text-xs text-green-600"
      >
      {authMode==="login" ? "Criar conta" : "Já tenho conta"}
      </button>

      </form>

      </div>

      </div>

    )}

    </div>

  )

}

export default App
