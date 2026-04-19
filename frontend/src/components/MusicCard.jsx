import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  ExternalLink,
  MoreHorizontal,
  User as UserIcon,
  Play,
  Sparkles
} from 'lucide-react'
import Comments from './Comments'

export default function MusicCard({ post, user }) {
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(false)
  const queryClient = useQueryClient()

  // --- MUTAÇÕES ---

  // Notifica o backend sobre interações para o algoritmo de RL
  const trackEventMutation = useMutation({
    mutationFn: (eventType) =>
    axios.post('/events', { post_id: post.id, event_type: eventType })
  })

  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/upvote`),
                                   onSuccess: () => {
                                     queryClient.invalidateQueries(['posts'])
                                     trackEventMutation.mutate('upvote') // RL signal
                                   },
                                   onError: (err) => {
                                     if (err.response?.status === 401) alert(t('login_to_vote'))
                                   }
  })

  const saveMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/save`),
                                   onSuccess: () => {
                                     queryClient.invalidateQueries(['posts'])
                                     queryClient.invalidateQueries(['saved-posts'])
                                   }
  })

  // --- LÓGICA DE RENDERIZAÇÃO ---

  const handleInteraction = () => {
    trackEventMutation.mutate('click')
  }

  const renderPlayer = () => {
    if (!post.embed_url) return null;

    const isSpotify = post.embed_url.includes('spotify');
    // Spotify usa 152px para o player médio ou 80px para o compacto. YouTube 200px+.
    const height = isSpotify ? "152px" : "240px";

    return (
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
      <iframe
      src={post.embed_url}
      className="w-full"
      style={{ height }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      onLoad={() => trackEventMutation.mutate('view')} // RL signal quando o player carrega
      />
      </div>
    );
  };

  if (!post) return null

    return (
      <div
      onClick={handleInteraction}
      className="group relative bg-white/95 dark:bg-[#0f1115] border border-black/5 dark:border-white/10 rounded-[32px] flex flex-col transition-all duration-300 hover:border-green-500/40 hover:shadow-[0_0_50px_-15px_rgba(0,156,59,0.3)] overflow-hidden"
      >
      <div className="flex">
      {/* COLUNA DE VOTOS */}
      <div className="w-12 md:w-14 flex flex-col items-center py-6 bg-black/[0.03] dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 shrink-0">
      <button
      onClick={(e) => { e.stopPropagation(); voteMutation.mutate(); }}
      className={`p-1 transition-all transform active:scale-150 ${post.voted ? 'text-green-600' : 'text-slate-400 hover:text-green-500'}`}
      >
      <ArrowBigUp size={32} fill={post.voted ? "currentColor" : "none"} />
      </button>

      <span className={`text-sm font-black my-1 ${post.voted ? 'text-green-600' : 'text-slate-500 dark:text-slate-400'}`}>
      {post.score || 0}
      </span>

      <button className="p-1 text-slate-300 dark:text-slate-600 hover:text-red-500">
      <ArrowBigDown size={32} />
      </button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-5 md:p-7 min-w-0">

      {/* HEADER (Metadata) */}
      <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3 flex-wrap">
      <Link to={`/profile/${post.author_username}`} className="flex items-center gap-2 group/user">
      <div className="w-6 h-6 rounded-lg bg-green-600 flex items-center justify-center text-[10px] font-black text-white italic">
      {post.author_username?.[0]?.toUpperCase()}
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover/user:text-green-600 transition-colors">
      u/{post.author_username}
      </span>
      </Link>

      <span className="text-slate-300 dark:text-slate-700">•</span>

      {post.sub_slug && (
        <Link to={`/s/${post.sub_slug}`} className="text-[11px] font-black text-green-600 uppercase hover:underline">
        s/{post.sub_slug}
        </Link>
      )}
      </div>

      <div className="flex items-center gap-2">
      {post.semantic_data?.tags?.length > 0 && <Sparkles size={14} className="text-green-500 animate-pulse" />}
      <button className="text-slate-400 hover:text-black dark:hover:text-white"><MoreHorizontal size={20}/></button>
      </div>
      </div>

      {/* TÍTULO E ARTISTA */}
      <div className="mb-4">
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
      {post.title}
      </h3>

      {post.artist && (
        <Link to={`/artist/${post.artist.slug}`} className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-green-600 hover:underline">
        <Music size={12} /> {post.artist.name}
        </Link>
      )}
      </div>

      {/* TEXTO / COMENTÁRIO DO AUTOR */}
      {post.content && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 leading-relaxed">
        {post.content}
        </p>
      )}

      {/* PLAYER AREA */}
      <div className="mb-6">
      {post.embed_url ? (
        renderPlayer()
      ) : post.thumbnail ? (
        <a href={post.url} target="_blank" rel="noreferrer" className="block relative rounded-2xl overflow-hidden border border-black/10 group/thumb">
        <img src={post.thumbnail} className="w-full h-48 object-cover transition-transform duration-500 group-hover/thumb:scale-110" alt="" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
        <Play size={48} className="text-white fill-white" />
        </div>
        </a>
      ) : (
        <a href={post.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-black/[0.03] dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hover:border-green-500 transition-all group/link">
        <span className="text-sm text-slate-500 italic truncate pr-4">{post.url}</span>
        <ExternalLink size={16} className="text-slate-400 group-hover/link:text-green-500" />
        </a>
      )}
      </div>

      {/* AÇÕES (Footer do Card) */}
      <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-black/5 dark:border-white/5">
      <button
      onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${showComments ? 'bg-green-600 text-white' : 'bg-black/[0.05] dark:bg-white/5 text-slate-500 hover:text-green-600'}`}
      >
      <MessageSquare size={16}/> {t('discussion')}
      </button>

      <button
      onClick={(e) => { e.stopPropagation(); saveMutation.mutate(); }}
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${post.is_saved ? 'bg-yellow-500/10 text-yellow-600' : 'text-slate-500 hover:text-yellow-500'}`}
      >
      <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"}/>
      {post.is_saved ? t('saved') : t('save')}
      </button>

      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 px-4 py-2 rounded-xl transition-all">
      <Share2 size={16}/> {t('share')}
      </button>

      {post.genre_name && (
        <span className="ml-auto bg-black/5 dark:bg-white/5 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
        {post.genre_name}
        </span>
      )}
      </div>

      {/* SEÇÃO DE COMENTÁRIOS EXPANSÍVEL */}
      {showComments && (
        <div className="mt-6 animate-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
        <Comments postId={post.id} user={user}/>
        </div>
      )}

      </div>
      </div>
      </div>
    )
}
