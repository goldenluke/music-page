import { useState, useRef, useEffect } from 'react';

import { Search, ChevronDown } from 'lucide-react';

export default function SearchableSelect({ options, placeholder, onSelect, label }) {
  const [query, setQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  const filtered = options.filter(opt => 
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const clickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{label}</label>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-green-500 transition-all"
        />
        <ChevronDown size={16} className={`absolute right-4 top-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#12141a] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-in zoom-in-95">
          {filtered.length > 0 ? filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                setQuery(opt.name);
                setIsOpen(false);
              }}
              className="w-full text-left p-4 text-sm hover:bg-green-600 transition-colors border-b border-white/5 last:border-0"
            >
              {opt.slug ? `s/${opt.slug}` : opt.name}
            </button>
          )) : (
            <div className="p-4 text-xs text-slate-600 italic">Nada encontrado...</div>
          )}
        </div>
      )}
    </div>
  );
}
