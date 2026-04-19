import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { ArrowLeft, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrendsPage() {
  const [period, setPeriod] = useState('week');

  const { data: trends, isLoading } = useQuery({
    queryKey: ['trends', period],
    queryFn: () => axios.get(`/api/trends/${period}`).then(res => res.data),
  });

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-green-500">ANALISANDO BIG DATA MUSICAL...</div>;

  return (
    <div className="min-h-screen bg-musica text-white p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {['today', 'week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${period === p ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Radar Chart: A Vibe da Comunidade */}
        <div className="bg-[#0f1115] p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <h3 className="text-xs font-black uppercase text-green-500 mb-8 flex items-center gap-2 italic">
            <Zap size={16} /> DNA Sônico ({trends.period_name})
          </h3>
          <Plot
            data={[{
              type: 'scatterpolar',
              r: [trends.vibe_radar.energy * 100, trends.vibe_radar.danceability * 100, trends.vibe_radar.valence * 100, trends.vibe_radar.energy * 100],
              theta: ['Energia', 'Dançabilidade', 'Humor (Valence)', 'Energia'],
              fill: 'toself',
              fillcolor: 'rgba(0, 156, 59, 0.3)',
              line: { color: '#009c3b', width: 3 }
            }]}
            layout={{
              polar: { radialaxis: { visible: true, range: [0, 100], color: '#333' }, bgcolor: 'transparent' },
              showlegend: false,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#666', family: 'Inter', size: 10 },
              width: 400, height: 400, margin: { t: 20, b: 20, l: 40, r: 40 }
            }}
            config={{ displayModeBar: false }}
          />
          <p className="text-[10px] text-slate-500 text-center mt-4">Este radar mostra a tendência acústica das músicas postadas.</p>
        </div>

        {/* Bar Chart: Gêneros em Alta */}
        <div className="bg-[#0f1115] p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 flex items-center gap-2 italic">
            <BarChart3 size={16} /> Gêneros Dominantes (Last.fm)
          </h3>
          <Plot
            data={[{
              x: Object.keys(trends.top_genres),
              y: Object.values(trends.top_genres),
              type: 'bar',
              marker: { color: 'rgba(0, 156, 59, 0.6)', line: { color: '#009c3b', width: 1.5 } }
            }]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#888', size: 9 },
              xaxis: { gridcolor: '#222', tickangle: -45 },
              yaxis: { gridcolor: '#222' },
              margin: { t: 20, b: 80, l: 40, r: 20 },
              width: 450, height: 350
            }}
            config={{ displayModeBar: false }}
          />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Volume de Descobertas</span>
            <div className="text-4xl font-black text-white mt-2">{trends.post_count}</div>
         </div>
         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 col-span-2">
            <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2"><TrendingUp size={12}/> Top Curadores do Período</span>
            <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
               {Object.entries(trends.top_artists).map(([name, score]) => (
                 <div key={name} className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-300">{name}</span>
                    <span className="ml-3 text-[10px] font-black text-green-600">{score} pts</span>
                 </div>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}
