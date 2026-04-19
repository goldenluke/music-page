import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ArrowLeft, MessageSquare, Activity, Sparkles, Zap } from "lucide-react"
import Comments from "../components/Comments"

export default function PostPage() {
  const { id } = useParams()

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => axios.get(`/api/posts/${id}`).then(res => res.data)
  })

  const { data: related = [] } = useQuery({
    queryKey: ["related", id],
    queryFn: () => axios.get(`/api/posts/${id}/related`).then(res => res.data),
    enabled: !!post
  })

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-green-500 text-xs uppercase tracking-[0.5em]">Sintonizando Frequências...</div>

  return (
    <div className="min-h-screen bg-musica text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-500 mb-12 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Voltar ao Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
          <main>
            <header className="mb-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.semantic_data?.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase bg-green-500/10 text-green-500 px-2 py-1 rounded"># {tag}</span>
                ))}
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4">{post.title}</h1>
              <div className="text-sm font-bold text-slate-400">Curadoria por u/{post.author_username}</div>
            </header>

            <div className="mb-16 rounded-[40px] overflow-hidden border border-white/10 bg-black shadow-2xl">
              {post.embed_url ? (
                <iframe src={`${post.embed_url}?autoplay=0`} width="100%" height="450" frameBorder="0" allow="autoplay; encrypted-media; fullscreen;" className="w-full"></iframe>
              ) : (
                <div className="p-20 text-center bg-white/5">
                   <a href={post.url} target="_blank" className="bg-green-600 px-10 py-4 rounded-2xl font-black uppercase text-xs">Abrir Fonte Original</a>
                </div>
              )}
            </div>

            {/* Wiki do Last.fm */}
            {post.semantic_data?.summary && (
              <div className="mb-16 p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4 flex items-center gap-2"><Sparkles size={14}/> Contexto Histórico (Last.fm)</h3>
                <p className="text-sm text-slate-400 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: post.semantic_data.summary }}></p>
              </div>
            )}

            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 flex items-center gap-3">
                <MessageSquare size={18} className="text-green-500" /> Discussão
              </h3>
              <Comments postId={post.id} user={true} />
            </section>
          </main>

          <aside className="space-y-12">
            <div>
              <h4 className="text-[10px] font-black uppercase text-green-500 mb-6 flex items-center gap-2">
                <Zap size={16} /> Deep Discovery
              </h4>
              <div className="space-y-4">
                {related.map(r => (
                  <Link key={r.id} to={`/post/${r.id}`} className="block p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-green-500/50 transition-all group">
                    <p className="text-xs font-black truncate group-hover:text-green-500 transition-colors">{r.title}</p>
                    <p className="text-[9px] text-slate-500 uppercase mt-1">u/{r.author_username} • {r.score} pts</p>
                  </Link>
                ))}
                {related.length === 0 && <p className="text-[10px] text-slate-600 italic font-medium">Nenhuma track com vibe parecida encontrada ainda...</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
