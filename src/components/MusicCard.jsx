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
  Play
} from 'lucide-react'
import Comments from './Comments'

export default function MusicCard({ post, user }) {
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(false)
  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/upvote`),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  const saveMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/save`),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  if (!post) return null

  return (
    <div className="group relative bg-white/95 dark:bg-[#0f1115] border border-black/5 dark:border-white/10 rounded-[32px] flex flex-col transition-all duration-300 hover:border-green-500/30 overflow-hidden">
      <div className="flex">
        {/* VOTOS */}
        <div className="w-12 md:w-14 flex flex-col items-center py-6 bg-black/[0.02] dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 shrink-0">
          <button onClick={() => voteMutation.mutate()} className={`p-1 ${post.voted ? 'text-green-500' : 'text-slate-400'}`}>
            <ArrowBigUp size={32} fill={post.voted ? "currentColor" : "none"} />
          </button>
          <span className="text-sm font-black my-1">{post.score || 0}</span>
          <button className="p-1 text-slate-300 hover:text-red-500"><ArrowBigDown size={32}/></button>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 p-5 md:p-7 min-w-0">
          <div className="flex justify-between items-start mb-4">
            <Link to={`/profile/${post.author_username}`} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-green-600 flex items-center justify-center text-[10px] font-black text-white italic">
                {post.author_username?.[0]?.toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">u/{post.author_username}</span>
            </Link>
            {post.genre_name && <span className="bg-green-600/10 text-green-500 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">{post.genre_name}</span>}
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{post.title}</h3>

          {/* PLAYER EMBED */}
          <div className="mb-6">
            {post.embed_url ? (
              <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/20">
                <iframe
                  src={post.embed_url}
                  width="100%"
                  height={post.embed_url.includes('spotify') ? "152" : "320"}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ) : (
              <a href={post.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10">
                <span className="text-xs text-slate-500 truncate">{post.url}</span>
                <ExternalLink size={16} className="text-slate-400" />
              </a>
            )}
          </div>

          <div className="flex gap-3 items-center pt-4 border-t border-black/5 dark:border-white/5">
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-green-600">
              <MessageSquare size={16}/> Discussão
            </button>
            <button onClick={() => saveMutation.mutate()} className={`flex items-center gap-2 text-[10px] font-black uppercase ${post.is_saved ? 'text-yellow-500' : 'text-slate-500'}`}>
              <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"}/> {post.is_saved ? 'Salvo' : 'Salvar'}
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 ml-auto">
              <Share2 size={16}/>
            </button>
          </div>

          {showComments && <div className="mt-6"><Comments postId={post.id} user={user}/></div>}
        </div>
      </div>
    </div>
  )
}
