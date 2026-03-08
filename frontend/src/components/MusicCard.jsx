import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
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
  CheckCircle2
} from 'lucide-react';
import Comments from './Comments';

export default function MusicCard({ post, user }) {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  // 1. MUTAÇÃO PARA VOTO (Toggle Upvote)
  // Como definimos baseURL: '/api' no App.jsx, usamos apenas caminhos relativos
  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/upvote`),
                                   onSuccess: () => {
                                     // Invalida a busca de posts para atualizar o score e o ícone na tela
                                     queryClient.invalidateQueries(['posts']);
                                   },
                                   onError: (err) => {
                                     if (err.response?.status === 401) alert(t('login_to_vote', 'Faça login para votar'));
                                   }
  });

  // 2. MUTAÇÃO PARA SALVAR (Bookmark)
  const saveMutation = useMutation({
    mutationFn: () => axios.post(`/posts/${post?.id}/save`),
                                   onSuccess: () => {
                                     queryClient.invalidateQueries(['posts']);
                                     queryClient.invalidateQueries(['saved-posts']);
                                   },
                                   onError: (err) => {
                                     if (err.response?.status === 401) alert(t('login_to_save', 'Faça login para salvar'));
                                   }
  });

  // 3. LOGICA DE EMBED (YouTube / Spotify)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const id = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes('spotify.com/track')) {
        const id = url.split('track/')[1]?.split('?')[0];
        return `https://open.spotify.com/embed/track/${id}`;
      }
    } catch (e) { return null; }
    return null;
  };

  const embedUrl = getEmbedUrl(post?.url);

  // Segurança: se o objeto post não vier, não renderiza o componente
  if (!post) return null;

  return (
    <div className="group relative bg-[#0f1115] border border-white/5 rounded-[32px] flex flex-col transition-all duration-300 hover:border-blue-500/30 hover:bg-[#13161c] hover:shadow-[0_0_50px_-20px_rgba(59,130,246,0.2)] overflow-hidden">

    <div className="flex">
    {/* COLUNA DE VOTOS - Lado Esquerdo */}
    <div className="w-12 md:w-14 flex flex-col items-center py-6 bg-black/20 rounded-l-[32px] border-r border-white/5 shrink-0">
    <button
    onClick={() => voteMutation.mutate()}
    className={`p-1 transition-all transform active:scale-150 ${post.voted ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'}`}
    >
    <ArrowBigUp
    size={32}
    fill={post.voted ? "currentColor" : "none"}
    strokeWidth={post.voted ? 2.5 : 2}
    />
    </button>

    <span className={`text-sm font-black my-1 transition-colors ${post.voted ? 'text-blue-500' : 'text-slate-200'}`}>
    {post.score || 0}
    </span>

    <button className="p-1 text-slate-500 hover:text-red-500 transition-colors">
    <ArrowBigDown size={32} />
    </button>
    </div>

    {/* CONTEÚDO DO POST - Lado Direito */}
    <div className="flex-1 p-5 md:p-7 min-w-0">

    {/* Header: Autor e Gênero */}
    <div className="flex justify-between items-start mb-4">
    <div className="flex items-center gap-3">
    <Link
    to={`/profile/${post.author_username}`}
    className="flex items-center gap-2 group/user overflow-hidden"
    >
    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black uppercase text-white shadow-lg shrink-0">
    {post.author_username?.[0]?.toUpperCase() || <UserIcon size={12}/>}
    </div>
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover/user:text-white transition-colors truncate max-w-[120px] md:max-w-none">
    u/{post.author_username || 'anon'}
    </span>
    </Link>

    {post.genre_name && (
      <span className="bg-blue-600/10 text-blue-500 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-blue-500/10 whitespace-nowrap">
      {post.genre_name}
      </span>
    )}
    </div>

    <button className="text-slate-600 hover:text-white transition-colors">
    <MoreHorizontal size={20} />
    </button>
    </div>

    {/* Título e Descrição */}
    <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors tracking-tight">
    {post.title}
    </h3>

    {post.content && (
      <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-3 italic">
      {post.content}
      </p>
    )}

    {/* Imagem do Post (Proxy do Vite resolve o /media) */}
    {post.image && (
      <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-black">
      <img
      src={post.image}
      alt={post.title}
      className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-700"
      loading="lazy"
      />
      </div>
    )}

    {/* Player Embed ou Link Visual */}
    <div className="relative mb-8">
    {embedUrl ? (
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 shadow-blue-500/5">
      <iframe
      src={embedUrl}
      className="w-full h-[80px]"
      allow="encrypted-media"
      loading="lazy"
      title={post.title}
      ></iframe>
      </div>
    ) : (
      <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/link"
      >
      <div className="flex items-center gap-3 truncate">
      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
      <Play size={14} fill="currentColor" />
      </div>
      <span className="text-sm text-slate-500 italic truncate font-medium">{post.url}</span>
      </div>
      <ExternalLink size={16} className="text-slate-700 group-hover/link:text-blue-400 transition-colors shrink-0 ml-2" />
      </a>
    )}
    </div>

    {/* BARRA DE AÇÕES (Rodapé) */}
    <div className="flex flex-wrap gap-3 md:gap-6 items-center pt-2 border-t border-white/5">
    <button
    onClick={() => setShowComments(!showComments)}
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-3 py-2 rounded-xl ${
      showComments
      ? 'bg-blue-500/10 text-blue-500 shadow-inner'
      : 'text-slate-500 hover:bg-white/5 hover:text-white'
    }`}
    >
    <MessageSquare size={16} strokeWidth={2.5} />
    {t('discussion')}
    </button>

    <button
    onClick={() => saveMutation.mutate()}
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-3 py-2 rounded-xl ${
      post.is_saved ? 'bg-orange-500/10 text-orange-500' : 'text-slate-500 hover:bg-white/5 hover:text-white'
    }`}
    >
    <Bookmark size={16} fill={post.is_saved ? "currentColor" : "none"} strokeWidth={2.5} />
    {post.is_saved ? t('saved') : t('save')}
    </button>

    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-white transition-all px-3 py-2 rounded-xl">
    <Share2 size={16} strokeWidth={2.5} />
    {t('share')}
    </button>
    </div>

    {/* SEÇÃO DE COMENTÁRIOS EXPANSÍVEL */}
    {showComments && (
      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
      <Comments postId={post.id} user={user} />
      </div>
    )}
    </div>
    </div>
    </div>
  );
}
