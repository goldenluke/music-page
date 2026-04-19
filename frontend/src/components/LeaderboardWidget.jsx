import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Zap, Trophy } from "lucide-react";

export default function LeaderboardWidget() {
  const { data: m, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => axios.get("/analytics").then(res => res.data),
    refetchInterval: 30000,
    initialData: { top_scouts: [] }
  });

  const scouts = m?.top_scouts || [];

  if (isLoading && scouts.length === 0) return <div className="animate-pulse text-[10px] text-slate-500">Calculando Karma...</div>;

  return (
    <div className="space-y-3">
      {scouts.length > 0 ? scouts.map((s, i) => (
        <div key={i} className="flex justify-between items-center group">
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-slate-500'}`}>
              {i + 1}
            </div>
            <span className="text-[11px] font-bold text-slate-300 group-hover:text-green-500 transition-colors">u/{s.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-green-500" fill="currentColor" />
            <span className="text-[10px] font-black text-slate-400">{s.total_score || 0}</span>
          </div>
        </div>
      )) : (
        <p className="text-[10px] text-slate-600 italic">Nenhum scout ativo no período...</p>
      )}
    </div>
  );
}
