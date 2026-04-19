import { Zap, Music } from "lucide-react";

export default function DiscoveryTicker() {
  const discoveries = [
    "u/admin acabou de descobrir uma relíquia de IDM",
    "Comunidade s/techno em alta (+25%)",
    "Novo set de Daft Punk subindo no ranking",
    "Mood 'Noite de Chuva' é o mais buscado hoje"
  ];

  return (
    <div className="w-full bg-green-600/10 border-y border-green-600/20 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="flex animate-marquee gap-10">
        {[...discoveries, ...discoveries].map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <Zap size={10} className="text-green-500 fill-green-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
