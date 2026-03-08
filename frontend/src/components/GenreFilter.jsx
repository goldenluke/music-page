import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { useRef } from 'react';

export default function GenreFilter({ activeGenre, onSelect }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => axios.get('/genres').then(res => res.data),
                                        staleTime: 1000 * 60 * 10,
  });

  // GARANTIA: Se genresData não for uma lista, tratamos como lista vazia
  const genres = Array.isArray(genresData) ? genresData : [];

  return (
    <div className="relative w-full max-w-full mb-8 group">
    <div className="flex items-center bg-[#0f1115]/50 border border-white/5 rounded-2xl p-1.5 backdrop-blur-sm">

    <div className="px-3 border-r border-white/5 text-slate-500">
    <Filter size={14} />
    </div>

    <div
    ref={scrollRef}
    className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-3 w-full"
    style={{ minWidth: 0 }}
    >
    <button
    onClick={() => onSelect(null)}
    className={`shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      !activeGenre
      ? 'bg-blue-600 text-white shadow-lg'
      : 'text-slate-500 hover:text-slate-300'
    }`}
    >
    {t('all')}
    </button>

    {/* MAP CORRIGIDO COM VERIFICAÇÃO */}
    {genres.map((genre) => (
      <button
      key={genre.id} // Chave única
      onClick={() => onSelect(genre.slug)}
      className={`shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
        activeGenre === genre.slug
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
      }`}
      >
      {genre.name}
      </button>
    ))}
    </div>

    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-8 bg-gradient-to-l from-[#0f1115] to-transparent pointer-events-none rounded-r-2xl"></div>
    </div>
    </div>
  );
}
