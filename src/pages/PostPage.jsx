import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ArrowLeft, MessageSquare, Activity, User, Sparkles } from "lucide-react"
import Comments from "../components/Comments"

export default function PostPage() {
  const { id } = useParams()

  // Busca dados do post
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => axios.get(`/posts/${id}`).then(res => res.data)
  })

  // Busca dados do usuário logado para passar para os comentários
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => axios.get("/me").then(res => res.data).catch(() => null)
  })

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-green-500">ABRINDO FREQUÊNCIAS...</div>
  if (!post) return <div className="p-20 text-center text-slate-500 font-black uppercase">Post não encontrado no banco de dados.</div>

  return (
    <div className="min-h-screen bg-musica text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-500 mb-12 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Voltar ao Canal
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
          <main>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-green-600 flex items-center justify-center text-sm font-black shadow-lg shadow-green-600/20 italic">
                  {post.author_username?.[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-0.5">s/{post.sub_slug}</div>
                  <div className="text-xs font-bold text-slate-400">por u/{post.author_username}</div>
                </div>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4">{post.title}</h1>
            </header>

            <div className="mb-16 rounded-[40px] overflow-hidden border border-white/10 bg-black shadow-2xl">
              {post.embed_url ? (
                <iframe src={`${post.embed_url}?autoplay=1`} width="100%" height={post.embed_url.includes('spotify') ? "352" : "500"} frameBorder="0" allow="autoplay; encrypted-media; fullscreen;" className="w-full"></iframe>
              ) : (
                <div className="p-20 text-center">
                   <p className="text-slate-500 italic mb-6">Nenhum player disponível.</p>
                   <a href={post.url} target="_blank" className="bg-green-600 px-10 py-4 rounded-2xl font-black uppercase text-xs hover:bg-green-500 transition">Abrir Fonte Externa</a>
                </div>
              )}
            </div>

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 flex items-center gap-3">
                <MessageSquare size={18} className="text-green-500" /> Discussão Aberta
              </h3>
              <Comments postId={post.id} user={user} />
            </section>
          </main>

          <aside className="space-y-10">
            {post.audio_features && (
              <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] ai-glow">
                <h4 className="text-[10px] font-black uppercase text-green-500 mb-8 flex items-center gap-2">
                  <Activity size={16} /> DNA Sônico
                </h4>
                <div className="space-y-6">
                  {['energy', 'danceability', 'valence'].map(feat => (
                    <div key={feat}>
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-2">
                        <span>{feat}</span>
                        <span className="text-green-500">{Math.round(post.audio_features[feat] * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${post.audio_features[feat] * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px]">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 flex items-center gap-2">
                <Sparkles size={16} /> Metadados IA
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.semantic_data?.tags?.map(t => (
                  <span key={t} className="text-[9px] font-black uppercase bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-green-500 cursor-default transition-colors">#{t}</span>
                )) || <span className="text-[10px] text-slate-600 italic">Sem tags processadas.</span>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
