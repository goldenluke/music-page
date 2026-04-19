import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowBigUp, Play, Sparkles, Activity } from 'lucide-react'

export default function MusicCard({ post, user }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Mutação para o Upvote
  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/api/posts/${post.id}/upvote`),
    onSuccess: () => {
      // Invalida o feed e o post individual para atualizar o contador na tela
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['post', post.id.toString()])
    },
    onError: (err) => {
      if (err.response?.status === 401) alert("Faça login para votar!")
    }
  })

  if (!post) return null

  return (
    <div 
      onClick={() => navigate(`/post/${post.id}`)}
      className="group relative bg-white/95 dark:bg-[#0f1115] border border-black/5 dark:border-white/10 rounded-[32px] flex flex-col transition-all duration-300 hover:border-green-500/40 hover:shadow-[0_0_40px_-15px_rgba(0,156,59,0.3)] overflow-hidden cursor-pointer"
    >
      <div className="flex">
        {/* COLUNA DE VOTOS */}
        <div 
          className="w-14 flex flex-col items-center py-6 bg-black/[0.02] dark:bg-white/[0.02] border-r border-inherit shrink-0" 
          onClick={(e) => e.stopPropagation()} // IMPEDE NAVEGAÇÃO AO CLICAR NO VOTO
        >
          <button 
            onClick={() => voteMutation.mutate()} 
            disabled={voteMutation.isPending}
            className={`p-1 transition-all transform active:scale-150 ${post.voted ? 'text-green-600' : 'text-slate-400 hover:text-green-500'}`}
          >
            <ArrowBigUp size={32} fill={post.voted ? "currentColor" : "none"} />
          </button>
          <span className={`text-sm font-black my-1 ${post.voted ? 'text-green-600' : 'text-slate-500'}`}>
            {post.score || 0}
          </span>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 p-7 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">u/{post.author_username}</span>
              {post.audio_features && <Activity size={14} className="text-green-500 animate-pulse" />}
            </div>
            <span className="text-[10px] font-black text-green-500 uppercase">s/{post.sub_slug}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-green-600 transition-colors">
            {post.title}
          </h3>

          <div className="relative rounded-2xl overflow-hidden h-44 bg-black shadow-lg">
            <img src={post.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800'} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-all duration-700" alt="" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
               <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl">
                 <Play size={24} fill="currentColor" className="ml-1" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
