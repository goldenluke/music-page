import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Users, Radio } from "lucide-react";

export default function LivePulse() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats").then((res) => res.data),
    refetchInterval: 30000, // Atualiza a cada 30s
  });

  return (
    <div className="flex flex-col gap-4 bg-green-600/5 border border-green-600/20 p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comunidade</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-green-500">{stats?.online_count || 0} online</span>
        </div>
      </div>
      
      <div className="text-xl font-black italic tracking-tighter">
        {stats?.total_members || 0} <span className="text-xs font-normal text-slate-500 not-italic">membros ativos</span>
      </div>
    </div>
  );
}
