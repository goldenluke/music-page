import { useEffect, useState } from "react";
import api from "@/lib/api";
import { SkipForward, Play } from "lucide-react";

export default function AutoPlayerWidget() {
  const [track, setTrack] = useState(null);

  const fetchNext = async () => {
    try {
      const res = await api.get("/autoplay/next");
      setTrack(res.data);
    } catch (e) {
      console.log("History empty");
    }
  };

  useEffect(() => { fetchNext(); }, []);

  if (!track) return <div className="text-[10px] text-slate-600 italic">Ouça algo para ativar o Autoplay IA...</div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-black">
        <img src={track.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'} className="w-full h-24 object-cover opacity-40 group-hover:opacity-60 transition-all" alt="" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play size={20} className="text-white fill-white" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
          <p className="text-[10px] font-black truncate text-white">{track.title}</p>
        </div>
      </div>
      
      <button 
        onClick={fetchNext}
        className="flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 py-2 rounded-xl text-[10px] font-black uppercase text-green-500 transition-all border border-green-600/20"
      >
        <SkipForward size={14} /> Próxima da Vibe
      </button>
    </div>
  );
}
