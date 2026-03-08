import { useState } from 'react';
import {
  Music,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Send,
  Loader2,
  Hash,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import GenreSearchSelect from './GenreSearchSelect';

export default function CreatePost() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // --- ESTADOS ---
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [genreId, setGenreId] = useState('');
  const [subId, setSubId] = useState('');

  // --- QUERIES ---
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: () => axios.get('/genres').then(res => res.data)
  });

  const { data: subs = [] } = useQuery({
    queryKey: ['subs'],
    queryFn: () => axios.get('/subs').then(res => res.data)
  });

  // --- MUTAÇÃO ---
  const mutation = useMutation({
    mutationFn: (formData) => axios.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setTitle(''); setUrl(''); setContent(''); setImage(null); setGenreId(''); setSubId('');
      alert(t('post_success'));
    },
    onError: (err) => {
      alert(err.response?.data?.detail || t('error_post'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url || !subId) {
      alert("Título, URL e Comunidade são obrigatórios!");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('url', url);
    formData.append('sub_id', subId);
    formData.append('content', content || "");
    if (image) formData.append('image', image);
    if (genreId) formData.append('genre_id', genreId);

    mutation.mutate(formData);
  };

  return (
    <div className="bg-[#0f1115] border border-white/5 p-6 md:p-8 rounded-[40px] mb-12 shadow-2xl relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>

    <div className="relative z-10">
    <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2 text-white">
    <Music className="text-blue-500" /> {t('new_beat')}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="relative">
    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
    <input
    value={title} onChange={e => setTitle(e.target.value)}
    className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-[20px] outline-none focus:border-blue-500/50 text-sm text-white"
    placeholder={t('track_title')}
    />
    </div>
    <div className="relative">
    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
    <input
    value={url} onChange={e => setUrl(e.target.value)}
    className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-[20px] outline-none focus:border-blue-500/50 text-sm text-white"
    placeholder={t('url_placeholder')}
    />
    </div>
    </div>

    <textarea
    value={content} onChange={e => setContent(e.target.value)}
    className="w-full bg-black/40 border border-white/5 p-5 rounded-[24px] outline-none focus:border-blue-500/50 text-sm text-white h-28 resize-none"
    placeholder={t('write_comment')}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* SELETOR DE COMUNIDADE CORRIGIDO COM VERIFICAÇÃO DE ARRAY */}
    <div className="relative h-14">
    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 z-10" size={18} />
    <select
    value={subId}
    onChange={(e) => setSubId(e.target.value)}
    className="w-full h-full bg-black/40 border border-white/5 p-4 pl-12 rounded-[20px] outline-none focus:border-blue-500/50 text-sm appearance-none text-white cursor-pointer relative"
    >
    <option value="" className="bg-[#0f1115]">{t('select_sub', 'Comunidade (s/)...')}</option>
    {Array.isArray(subs) && subs.map(s => (
      <option key={s.id} value={s.id} className="bg-[#0f1115]">s/{s.slug}</option>
    ))}
    </select>
    </div>

    <div className="h-14">
    <GenreSearchSelect
    genres={Array.isArray(genres) ? genres : []}
    selectedId={genreId}
    onSelect={(id) => setGenreId(id)}
    />
    </div>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
    <label className="w-full flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-[20px] cursor-pointer hover:border-blue-500/50 transition-all text-slate-500 overflow-hidden">
    {image ? <CheckCircle2 className="text-green-500" size={20} /> : <ImageIcon size={20} />}
    <span className="text-xs font-black uppercase tracking-widest truncate">
    {image ? image.name : t('upload_img', 'Capa do Álbum')}
    </span>
    <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
    </label>

    <button
    type="submit"
    disabled={mutation.isPending || !title || !url || !subId}
    className="w-full md:w-72 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-[20px] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-20 flex items-center justify-center gap-3"
    >
    {mutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
    <span className="uppercase tracking-[0.2em] text-[11px]">{t('btn_post')}</span>
    </button>
    </div>
    </form>
    </div>
    </div>
  );
}
