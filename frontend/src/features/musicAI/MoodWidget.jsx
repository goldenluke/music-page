import { useState } from "react";
import api from "@/lib/api";
import { Search, Sparkles } from "lucide-react";

export default function MoodWidget() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.get(`/mood-search?q=${q}`);
      setResults(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ex: Noite chuvosa em SP..."
          className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/20 border border-white/10 text-[11px] outline-none focus:border-green-500 transition-all"
        />
        <button onClick={handleSearch} className="absolute right-2 top-1.5 text-green-500">
          {loading ? <Sparkles size={16} className="animate-spin"/> : <Search size={16}/>}
        </button>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[10px] flex justify-between items-center group cursor-pointer hover:border-green-500 transition-all">
            <span className="truncate flex-1 font-bold text-slate-300 group-hover:text-white">{r.title}</span>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(r.score || 0.5) * 100}%` }}></div>
              </div>
              <span className="text-[8px] font-black text-green-500">{(r.score * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
