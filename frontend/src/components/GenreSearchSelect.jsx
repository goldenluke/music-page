import { useState, useMemo } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GenreSearchSelect({ genres, selectedId, onSelect }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Filtra os gêneros em tempo real conforme o usuário digita
  const filteredGenres = useMemo(() => {
    return genres.filter(g => 
      g.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [genres, search]);

  const selectedGenre = genres.find(g => g.id === parseInt(selectedId));

  return (
    <div className="relative w-full h-full">
      {/* Gatilho / Campo de Texto */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-green-500 transition-all group"
      >
        <span className={selectedGenre ? "text-white text-sm" : "text-slate-500 text-sm"}>
          {selectedGenre ? selectedGenre.name : t('select_genre', 'Buscar Gênero...')}
        </span>
        <ChevronDown size={18} className={`text-slate-600 group-hover:text-green-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown de Busca */}
      {isOpen && (
        <div className="absolute top-[110%] left-0 w-full bg-[#12141a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-white/5 flex items-center gap-3 bg-white/5">
            <Search size={16} className="text-slate-500" />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('type_to_filter', 'Digitar gênero...')}
              className="bg-transparent border-none outline-none text-sm w-full text-white"
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredGenres.length > 0 ? (
              filteredGenres.map(g => (
                <div 
                  key={g.id}
                  onClick={() => {
                    onSelect(g.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="p-4 flex items-center justify-between hover:bg-green-600 transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{g.name}</span>
                  {selectedId === g.id && <Check size={16} className="text-white" />}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-600 text-xs font-black uppercase tracking-widest italic">
                {t('no_genre_found', 'Nada encontrado')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && <div className="fixed inset-0 z-[190]" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
