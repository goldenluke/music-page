import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import axios from "axios"

// Componentes Core
import MusicCard from "./components/MusicCard"
import CreatePost from "./components/CreatePost"
import GenreFilter from "./components/GenreFilter"
import SkeletonCard from "./components/SkeletonCard"
import NotificationsDropdown from "./components/NotificationsDropdown"

// Widgets de Inteligência Artificial e Comunidade
import MoodWidget from "./features/musicAI/MoodWidget"
import AutoPlayerWidget from "./features/musicAI/AutoPlayerWidget"
import AIParameters from "./components/AIParameters"
import LivePulse from "./components/LivePulse"
import LeaderboardWidget from "./components/LeaderboardWidget"
import YoutubeIngest from "./components/YoutubeIngest"
import GraphExplorer from "./components/GraphExplorer"
import DiscoveryTicker from "./components/DiscoveryTicker"
import Analytics from "./components/Analytics"
// Ícones
import {
  Music, Bell, LogOut, Compass, Zap, X, Loader2, Hash, Plus, Search, Sparkles, Award, BarChart3, Sun, Moon
} from "lucide-react"

axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true

function App() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { subSlug } = useParams()
  const { ref, inView } = useInView()

  // Estados de Interface
  const [authMode, setAuthMode] = useState(null)
  const [showCreateSub, setShowCreateSub] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

  // Estados de Filtro e Busca
  const [sort, setSort] = useState("latest")
  const [search, setSearch] = useState("")
  const [activeGenre, setActiveGenre] = useState(null)

  // Controle de Tema (Dark/Light)
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  // Checar sessão do usuário ao carregar
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
    } catch (err) {
      alert(err.response?.data?.detail || "Erro na autenticação")
    }
  }

  // Notificações (Sincronizado com backend /notifications)
  const { data: notificationsData = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axios.get("/notifications").then(res => res.data).catch(() => []),
    enabled: !!user,
    refetchInterval: 15000
  })

  const unreadCount = Array.isArray(notificationsData) ? notificationsData.filter(n => !n.is_read).length : 0

  // Comunidades (Subs)
  const { data: allSubs = [] } = useQuery({
    queryKey: ["subs"],
    queryFn: () => axios.get("/subs").then(res => res.data).catch(() => [])
  })

  // --- LÓGICA DE FEED INTELIGENTE (IA & RL) ---
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["posts", sort, search, activeGenre, subSlug],
    queryFn: async ({ pageParam = 0 }) => {
      let endpoint = "/posts";
      // Seleciona endpoint de IA/RL se o modo for 'smart'
      if (sort === "smart") endpoint = "/feed/rl";
      
      const res = await axios.get(endpoint, {
        params: { sort, search, genre: activeGenre, sub_slug: subSlug, limit: 10, offset: pageParam }
      });
      // Aceita tanto lista direta quanto {results: []} vindo do recommender
      return Array.isArray(res.data) ? res.data : (res.data.results || []);
    },
    getNextPageParam: (lastPage) => (lastPage && lastPage.length >= 10) ? true : undefined,
    initialPageParam: 0
  })

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  const allPosts = useMemo(() => postsData?.pages?.flat() || [], [postsData])

  return (
    <div className="min-h-screen bg-musica text-black dark:text-white font-sans transition-colors duration-300 pb-20">
      
      {/* NAVBAR */}
      <nav className="border-b border-black/10 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-green-600/30">
              <Music className="text-white -rotate-12"/>
            </div>
            <h1 className="text-xl font-black italic tracking-tighter">MusicaBR</h1>
          </Link>

          {/* BARRA DE BUSCA GLOBAL */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Buscar música, artistas ou vibes..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-600 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-slate-500" size={16} />
          </div>

          {/* AÇÕES DA NAV */}
          <div className="flex gap-4 items-center shrink-0">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-full bg-green-600/10 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
              {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            {user?.id ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-slate-500 hover:text-green-600 transition">
                    <Bell size={20}/>
                    {unreadCount > 0 && <span className="absolute top-1 right-1 text-[9px] bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{unreadCount}</span>}
                  </button>
                  {showNotifs && <NotificationsDropdown notifications={notificationsData}/>}
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 transition"><LogOut size={20}/></button>
              </div>
            ) : (
              <button onClick={() => setAuthMode("login")} className="bg-green-600 px-6 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-green-500 transition shadow-lg shadow-green-600/20">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <DiscoveryTicker />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        
        {/* SIDEBAR ESQUERDA */}
        <aside className="hidden lg:block space-y-8">
          <LivePulse />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Comunidades</h3>
              <button onClick={() => setShowCreateSub(true)} className="text-green-600 hover:bg-green-600/10 p-1 rounded transition"><Plus size={16}/></button>
            </div>
            <nav className="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              <Link to="/" className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-green-600/10 transition font-bold"><Compass size={16}/> Feed Geral</Link>
              {allSubs.map(sub => (
                <Link key={sub.slug} to={`/s/${sub.slug}`} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-green-600/10 transition text-slate-400 hover:text-green-600"><Hash size={16}/> s/{sub.slug}</Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <AIParameters />
            
            <div className="bg-white/50 dark:bg-[#0f1115] p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm ai-glow">
              <h4 className="text-[10px] font-black mb-4 text-green-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12}/> Mood AI Search</h4>
              <MoodWidget />
            </div>

            <YoutubeIngest />
            <GraphExplorer />

            <div className="bg-white/50 dark:bg-[#0f1115] p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
              <h4 className="text-[10px] font-black mb-4 text-green-500 uppercase tracking-widest flex items-center gap-2"><Award size={12}/> Top Scouts</h4>
              <LeaderboardWidget />
            </div>

            <Link to="/analytics" className="flex items-center justify-center gap-2 p-4 bg-green-600/10 border border-green-600/20 rounded-2xl text-[10px] font-black uppercase text-green-600 hover:bg-green-600 hover:text-white transition">
              <BarChart3 size={14}/> Live Analytics
            </Link>
          </div>
        </aside>

        {/* FEED PRINCIPAL */}
        <main className="min-w-0">
          {user?.id && <div className="mb-10"><CreatePost /></div>}
          
          <div className="flex gap-2 mb-8 flex-wrap">
            {["latest", "top", "smart"].map((m) => (
              <button 
                key={m} 
                onClick={() => setSort(m)} 
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sort === m ? "bg-green-600 text-white shadow-xl shadow-green-600/30" : "bg-black/5 dark:bg-white/5 text-slate-500 hover:bg-black/10 dark:hover:bg-white/10"}`}
              >
                {m === "smart" ? "✨ IA Feed" : m}
              </button>
            ))}
          </div>

          <GenreFilter activeGenre={activeGenre} onSelect={setActiveGenre}/>

          <div className="flex flex-col gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => <SkeletonCard key={i}/>)
            ) : (
              <>
                {allPosts.map(post => (
                  <MusicCard key={post.id} post={post} user={user}/>
                ))}
                
                <div ref={ref} className="py-20 flex justify-center">
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-2 text-green-600">
                      <Loader2 className="animate-spin" size={32}/>
                      <span className="text-[8px] font-black uppercase tracking-widest">Sincronizando Vibes...</span>
                    </div>
                  ) : (
                    <Zap className="opacity-10 text-green-500" size={40}/>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* MODAL DE AUTENTICAÇÃO */}
      {authMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] w-full max-w-sm relative shadow-2xl border border-white/10">
            <button onClick={() => setAuthMode(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-6 text-center tracking-tighter italic">MusicaBR</h2>
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <input name="username" placeholder="Seu usuário" required className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-600 outline-none transition"/>
              {authMode === "signup" && <input name="email" type="email" placeholder="Seu melhor e-mail" required className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-600 outline-none transition"/>}
              <input name="password" type="password" placeholder="Sua senha secreta" required className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-green-600 outline-none transition"/>
              <button type="submit" className="bg-green-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest mt-2 hover:bg-green-500 transition shadow-lg shadow-green-600/20">
                {authMode === "login" ? "Entrar na Music Page" : "Criar minha conta"}
              </button>
              <button type="button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-xs font-bold text-green-600 hover:underline text-center mt-2">
                {authMode === "login" ? "Ainda não é membro? Comece aqui" : "Já faz parte? Entre agora"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
