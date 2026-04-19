import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  User,
  Zap,
  ArrowLeft,
  Calendar,
  Music,
  Bookmark,
  Clock,
  LayoutGrid
} from 'lucide-react';
import MusicCard from '../components/MusicCard';
import SkeletonCard from '../components/SkeletonCard';

export default function ProfilePage() {
  const { username } = useParams();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Verifica quem é o usuário logado para saber se o perfil é dele mesmo
  useEffect(() => {
    api.get('/api/me')
    .then(res => setCurrentUser(res.data))
    .catch(() => setCurrentUser(null));
  }, []);

  const isOwnProfile = currentUser?.username === username;

  // 2. Busca os dados básicos do perfil (Karma, Data de ingresso)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => api.get(`/api/user/${username}`).then(res => res.data),
  });

  // 3. Busca as postagens feitas por este usuário
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['user-posts', username],
    queryFn: () => api.get(`/api/user/${username}/posts`).then(res => res.data),
  });

  // 4. Busca as postagens SALVAS (Biblioteca) - Apenas se for o próprio perfil
  const { data: savedPosts, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: () => api.get('/api/me/saved').then(res => res.data),
                                                                   enabled: isOwnProfile && activeTab === 'saved', // Só busca se necessário
  });

  const displayPosts = activeTab === 'posts' ? userPosts : savedPosts;
  const isLoadingContent = activeTab === 'posts' ? isLoadingPosts : isLoadingSaved;

  return (
    <div className="min-h-screen bg-[#050608] text-slate-200 font-sans selection:bg-green-500/30">
    <div className="max-w-5xl mx-auto px-6 py-12">

    {/* Botão Voltar */}
    <Link
    to="/"
    className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
    >
    <div className="p-2 bg-white/5 rounded-xl group-hover:bg-green-600 transition-colors">
    <ArrowLeft size={16} />
    </div>
    {t('back_to_feed', 'Back to Feed')}
    </Link>

    {/* CABEÇALHO DO PERFIL */}
    <header className="bg-[#0f1115] border border-white/5 p-8 md:p-12 rounded-[48px] mb-12 shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
    {/* Avatar Grande */}
    <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-indigo-700 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-600/20 rotate-3">
    <User size={60} className="text-white -rotate-3" />
    </div>

    <div className="flex-1 text-center md:text-left">
    <h1 className="text-5xl font-black tracking-tighter uppercase italic italic mb-4">
    u/{username}
    </h1>

    <div className="flex flex-wrap justify-center md:justify-start gap-8">
    <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t('karma', 'Karma')}</span>
    <span className="text-xl font-black text-green-500 flex items-center gap-2">
    <Zap size={20} fill="currentColor" /> {profile?.karma || 0}
    </span>
    </div>

    <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t('joined', 'Membro desde')}</span>
    <span className="text-xl font-black text-slate-200 flex items-center gap-2">
    <Calendar size={20} /> {profile?.joined_at || '...'}
    </span>
    </div>
    </div>
    </div>
    </div>
    </header>

    {/* NAVEGAÇÃO DE ABAS */}
    <div className="flex items-center gap-10 mb-10 border-b border-white/5 px-4">
    <button
    onClick={() => setActiveTab('posts')}
    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${
      activeTab === 'posts' ? 'text-green-500' : 'text-slate-500 hover:text-white'
    }`}
    >
    <LayoutGrid size={18} /> {t('my_posts', 'Postagens')}
    {activeTab === 'posts' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-green-500 rounded-full animate-in fade-in"></span>}
    </button>

    {isOwnProfile && (
      <button
      onClick={() => setActiveTab('saved')}
      className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${
        activeTab === 'saved' ? 'text-green-500' : 'text-slate-500 hover:text-white'
      }`}
      >
      <Bookmark size={18} /> {t('my_library', 'Biblioteca')}
      {activeTab === 'saved' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-green-500 rounded-full animate-in fade-in"></span>}
      </button>
    )}
    </div>

    {/* LISTAGEM DE CONTEÚDO */}
    <div className="flex flex-col gap-6">
    {isLoadingContent ? (
      [1, 2, 3].map(i => <SkeletonCard key={i} />)
    ) : displayPosts?.length > 0 ? (
      displayPosts.map(post => (
        <MusicCard key={post.id} post={post} user={currentUser} />
      ))
    ) : (
      <div className="text-center py-32 bg-[#0f1115] rounded-[40px] border border-dashed border-white/10">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
      {activeTab === 'posts' ? <Music size={32} className="text-slate-700" /> : <Bookmark size={32} className="text-slate-700" />}
      </div>
      <h3 className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
      {activeTab === 'posts' ? t('no_posts_yet', 'Nenhuma música postada') : t('no_saved_yet', 'Biblioteca vazia')}
      </h3>
      </div>
    )}
    </div>

    </div>

    {/* FOOTER */}
    <footer className="max-w-5xl mx-auto px-6 py-20 text-center opacity-20">
    <div className="flex items-center justify-center gap-2 mb-4">
    <Music size={16} />
    <span className="font-black text-xs uppercase tracking-tighter italic">Music Page</span>
    </div>
    <p className="text-[10px] font-bold uppercase tracking-widest">Global Music Discovery Platform</p>
    </footer>
    </div>
  );
}
