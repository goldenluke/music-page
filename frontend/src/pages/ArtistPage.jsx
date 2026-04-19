import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import MusicCard from "../components/MusicCard";
import { Music, Share2, Info, ArrowLeft } from "lucide-react";

export default function ArtistPage() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["artist", slug],
    queryFn: () => api.get(`/artists/${slug}`).then((res) => res.data),
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-green-600">Sincronizando Artista...</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-musica text-white pb-20">
      {/* Header Artístico */}
      <div className="relative h-64 bg-gradient-to-b from-green-600/20 to-transparent flex items-end px-6 pb-10">
        <Link to="/" className="absolute top-10 left-6 p-3 bg-black/20 rounded-2xl hover:bg-green-600 transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="max-w-7xl mx-auto w-full flex items-end gap-6">
          <div className="w-32 h-32 bg-green-600 rounded-[32px] shadow-2xl flex items-center justify-center text-5xl font-black italic border-4 border-[#050608]">
            {data.artist.name[0]}
          </div>
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter mb-2">{data.artist.name}</h1>
            <div className="flex gap-2">
              {data.genres.map(g => (
                <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-green-500">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 mt-10">
        {/* Lista de Músicas */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 italic">Top Curadoria</h2>
          {data.posts.map(p => <MusicCard key={p.id} post={p} />)}
        </section>

        {/* Sidebar de Descoberta IA */}
        <aside className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
              <Info size={14} /> Relacionados (Grafo IA)
            </h3>
            <div className="flex flex-col gap-3">
              {data.related_artists.map(ra => (
                <Link key={ra.slug} to={`/artist/${ra.slug}`} className="p-3 bg-black/20 rounded-xl hover:bg-green-600 transition group flex items-center justify-between">
                  <span className="text-sm font-bold">{ra.name}</span>
                  <Music size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Comunidades Ativas</h3>
            <div className="flex flex-wrap gap-2">
              {data.subs.map(s => (
                <Link key={s} to={`/s/${s}`} className="text-xs font-bold text-slate-400 hover:text-green-500">
                  s/{s}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
