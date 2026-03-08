import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

// Componentes Internos (Garante que eles existam na pasta ./components/)
import MusicCard from './components/MusicCard';
import CreatePost from './components/CreatePost';
import GenreFilter from './components/GenreFilter';
import SkeletonCard from './components/SkeletonCard';
import NotificationsDropdown from './components/NotificationsDropdown';

// Ícones
import {
  Music, TrendingUp, Bell, User, Clock, Search, LogOut,
  Compass, Zap, X, Languages, Loader2, Hash, Plus, Send
} from 'lucide-react';

// --- CONFIGURAÇÃO MESTRE DO AXIOS ---
// O baseURL '/api' faz o React conversar com o Proxy do Vite configurado no vite.config.js
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

function App() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { subSlug } = useParams(); // Captura /s/:subSlug
  const { ref, inView } = useInView();

  // --- Estados de Interface ---
  const [authMode, setAuthMode] = useState(null);
  const [showCreateSub, setShowCreateSub] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [user, setUser] = useState(null);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);

  // --- 1. Lógica de Autenticação ---

  useEffect(() => {
    axios.get('/me')
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
      queryClient.invalidateQueries(); // Limpa todo o cache por segurança
    } catch (err) { console.error(err); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/login' : '/register';
    const payload = {
      username: e.target.username.value,
      password: e.target.password.value,
      ...(authMode === 'signup' && { email: e.target.email.value })
    };
    try {
      const res = await axios.post(endpoint, payload);
      setUser(res.data);
      setAuthMode(null);
      queryClient.invalidateQueries();
    } catch (err) {
      alert(err.response?.data?.detail || t('error_auth'));
    }
  };

  // --- 2. Queries Blindadas (Previnem erros .map) ---

  const { data: notificationsData = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => axios.get('/notifications').then(res => res.data),
                                                    enabled: !!user,
                                                    refetchInterval: 15000,
  });
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => axios.get('/stats').then(res => res.data),
                                   refetchInterval: 30000,
  });

  const { data: allSubsData = [] } = useQuery({
    queryKey: ['subs'],
    queryFn: () => axios.get('/subs').then(res => res.data),
  });
  const allSubs = Array.isArray(allSubsData) ? allSubsData : [];

  const { data: subData } = useQuery({
    queryKey: ['sub', subSlug],
    queryFn: () => axios.get(`/subs/${subSlug}`).then(res => res.data),
                                     enabled: !!subSlug,
  });

  // Busca Infinita de Posts
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['posts', sort, search, activeGenre, subSlug],
    queryFn: ({ pageParam = 0 }) =>
    axios.get('/posts', {
      params: { sort, search, genre: activeGenre, sub_slug: subSlug, limit: 10, offset: pageParam }
    }).then(res => res.data),
                       getNextPageParam: (lastPage) => lastPage?.length === 10 ? true : undefined, // Simplificado para o exemplo
                       initialPageParam: 0,
  });

  // Gatilho do Scroll
  useEffect(() => { if (inView && hasNextPage) fetchNextPage(); }, [inView, hasNextPage]);

  // Extração segura dos posts
  const allPosts = useMemo(() => postsData?.pages?.flat() || [], [postsData]);

  // --- 3. Mutações ---
  const createSubMutation = useMutation({
    mutationFn: (newSub) => axios.post('/subs', newSub),
                                        onSuccess: (res) => {
                                          queryClient.invalidateQueries(['subs']);
                                          setShowCreateSub(false);
                                          navigate(`/s/${res.data.slug}`);
                                        },
  });

  const joinMutation = useMutation({
    mutationFn: () => axios.post(`/subs/${subSlug}/join`),
                                   onSuccess: () => queryClient.invalidateQueries(['sub', subSlug]),
  });

  return (
    <div className="min-h-screen bg-[#050608] text-slate-200 antialiased font-sans">

    {/* NAVBAR */}
    <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-[100]">
    <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-8">
    <Link to="/" className="flex items-center gap-3 shrink-0 group">
    <div className="w-10 h-10 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
    <Music size={24} className="text-white -rotate-12" />
    </div>
    <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic hidden sm:block">Music Page</h1>
    </Link>

    <div className="flex-1 max-w-md relative group hidden md:block">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
    <input
    type="text" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)}
    className="w-full bg-white/5 border border-white/10 p-2.5 pl-12 rounded-2xl outline-none focus:border-blue-500/40 text-sm"
    />
    </div>

    <div className="flex gap-4 items-center shrink-0">
    <button onClick={() => i18n.changeLanguage(i18n.language.startsWith('pt') ? 'en' : 'pt')} className="text-[10px] font-black text-slate-500 hover:text-white transition uppercase">
    {i18n.language.split('-')[0]}
    </button>
    {user ? (
      <div className="flex items-center gap-4">
      <div className="relative">
      <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-slate-500 hover:text-white relative">
      <Bell size={22} />
      {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center">{unreadCount}</span>}
      </button>
      {showNotifs && <NotificationsDropdown notifications={notifications} />}
      </div>
      <Link to={`/profile/${user.username}`} className="text-xs font-bold text-blue-500 hidden lg:block">@{user.username}</Link>
      <button onClick={handleLogout} className="text-red-500 p-2"><LogOut size={18} /></button>
      </div>
    ) : (
      <button onClick={() => setAuthMode('login')} className="bg-white text-black px-6 py-2 rounded-xl font-black text-xs uppercase">{t('login')}</button>
    )}
    </div>
    </div>
    </nav>

    {/* GRID LAYOUT */}
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-12">

    {/* SIDEBAR ESQUERDA */}
    <aside className="hidden lg:block space-y-6">
    <div className="flex justify-between items-center px-4">
    <h3 className="text-[10px] font-black uppercase text-slate-500 italic">{t('communities')}</h3>
    {user && <button onClick={() => setShowCreateSub(true)} className="text-blue-500 hover:bg-blue-500/10 p-1 rounded-lg"><Plus size={16}/></button>}
    </div>
    <nav className="flex flex-col gap-1">
    <Link to="/" className={`p-3 rounded-2xl flex items-center gap-3 transition-all ${!subSlug ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
    <Compass size={18} /> <span className="text-sm font-bold">{t('nav_feed')}</span>
    </Link>
    {allSubs.map(sub => (
      <Link key={`sub-${sub.slug}`} to={`/s/${sub.slug}`} className={`p-3 rounded-2xl flex items-center gap-3 transition-all ${subSlug === sub.slug ? 'bg-white/10 text-blue-500 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
      <Hash size={18} /> <span className="text-sm font-bold">s/{sub.slug}</span>
      </Link>
    ))}
    </nav>
    </aside>

    {/* FEED CENTRAL */}
    <main className="min-w-0">
    {subSlug && subData && (
      <div className="bg-[#0f1115] p-8 rounded-[40px] mb-10 border border-white/5 flex justify-between items-center shadow-2xl">
      <div>
      <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">s/{subSlug}</h2>
      <p className="text-slate-500 text-sm mt-1">{subData.member_count} {t('members')}</p>
      </div>
      <button onClick={() => joinMutation.mutate()} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${subData.is_member ? 'bg-white/5 text-white' : 'bg-blue-600 text-white'}`}>
      {subData.is_member ? t('leave') : t('join')}
      </button>
      </div>
    )}

    {user ? <CreatePost /> : (
      <div className="p-10 bg-[#0f1115] rounded-[40px] text-center border border-dashed border-white/10 mb-10">
      <h3 className="text-xl font-black uppercase italic mb-4">{t('start_sharing')}</h3>
      <button onClick={() => setAuthMode('signup')} className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase">{t('signup')}</button>
      </div>
    )}

    <GenreFilter activeGenre={activeGenre} onSelect={setActiveGenre} />

    <div className="flex flex-col gap-6">
    {isLoading ? (
      [1,2,3].map(i => <SkeletonCard key={`skel-${i}`} />)
    ) : (
      <>
      {allPosts.map((post, idx) => (
        <MusicCard key={`post-${post.id || idx}`} post={post} user={user} />
      ))}
      <div ref={ref} className="py-20 flex justify-center">
      {isFetchingNextPage ? <Loader2 className="animate-spin text-blue-500" /> : <Zap size={24} className="opacity-10" />}
      </div>
      </>
    )}
    </div>
    </main>

    {/* SIDEBAR DIREITA */}
    <aside className="hidden lg:block space-y-8">
    <div className="bg-[#0f1115] p-8 rounded-[32px] border border-white/5 shadow-xl sticky top-24">
    <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">{t('community_label')}</h3>
    <div className="space-y-4 border-t border-white/5 pt-6">
    <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
    <span>{t('members')}</span> <span className="text-white italic">{stats?.total_members || 0}</span>
    </div>
    <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
    <span>{t('online')}</span> <span className="text-green-500">● {stats?.online_count || 0}</span>
    </div>
    </div>
    </div>
    </aside>
    </div>

    {/* MODAL AUTH */}
    {authMode && (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-[#0f1115] p-10 rounded-[40px] border border-white/10 max-w-sm w-full relative shadow-2xl animate-in zoom-in">
      <button onClick={() => setAuthMode(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X /></button>
      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 mx-auto"><Music className="text-white" size={28} /></div>
      <h2 className="text-3xl font-black mb-10 text-center uppercase italic tracking-tighter">
      {authMode === 'login' ? t('login') : t('signup')}
      </h2>
      <form onSubmit={handleAuth} className="flex flex-col gap-4">
      <input name="username" placeholder={t('username')} required className="bg-black/40 p-4 rounded-2xl border border-white/5 outline-none focus:border-blue-500 text-sm" />
      {authMode === 'signup' && <input name="email" type="email" placeholder={t('email')} required className="bg-black/40 p-4 rounded-2xl border border-white/5 outline-none focus:border-blue-500 text-sm" />}
      <input name="password" type="password" placeholder={t('password')} required className="bg-black/40 p-4 rounded-2xl border border-white/5 outline-none focus:border-blue-500 text-sm" />
      <button type="submit" className="bg-blue-600 p-4 rounded-2xl font-black uppercase shadow-lg shadow-blue-600/20 mt-4">{authMode === 'login' ? t('login') : t('signup')}</button>
      <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-[10px] uppercase font-black text-slate-600 hover:text-blue-500 mt-2">
      {authMode === 'login' ? t('not_member') : t('already_member')}
      </button>
      </form>
      </div>
      </div>
    )}

    {/* MODAL CRIAR SUB */}
    {showCreateSub && (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-[#0f1115] border border-white/10 p-12 rounded-[48px] max-w-sm w-full shadow-2xl relative animate-in zoom-in">
      <button onClick={() => setShowCreateSub(false)} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-all"><X /></button>
      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg"><Hash className="text-white" size={28} /></div>
      <h2 className="text-3xl font-black mb-10 text-center tracking-tighter uppercase italic">{t('create_sub', 'Nova Sub')}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        createSubMutation.mutate({ name: e.target.name.value, description: e.target.description.value });
      }} className="space-y-4">
      <input name="name" placeholder={t('sub_name', 'Nome da Sub')} required className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm text-white" />
      <textarea name="description" placeholder={t('sub_desc', 'Descrição')} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm text-white h-24 resize-none" />
      <button type="submit" disabled={createSubMutation.isPending} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
      {createSubMutation.isPending ? <Loader2 className="animate-spin" /> : <Send size={18} />} {t('create_sub')}
      </button>
      </form>
      </div>
      </div>
    )}
    </div>
  );
}

export default App;
