import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { ArrowLeft, Activity, Brain, PieChart, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnalyticsPage() {
  const { data: m, isLoading } = useQuery({
    queryKey: ['global-analytics'],
    queryFn: () => axios.get('/api/analytics').then(res => res.data),
    refetchInterval: 60000
  });

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-green-500">SINTONIZANDO BIG DATA...</div>;

  const darkLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#888', size: 10 },
    margin: { t: 30, b: 30, l: 30, r: 30 },
    showlegend: false
  };

  return (
    <div className="min-h-screen bg-musica text-white p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-green-500 mb-6 font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16} /> Voltar ao Canal
          </Link>
          <h1 className="text-5xl font-black italic tracking-tighter flex items-center gap-4">
            <Activity className="text-green-500" size={40} /> Live Intelligence
          </h1>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
            <div className="text-[10px] font-black uppercase text-slate-500">Catálogo Total</div>
            <div className="text-3xl font-black text-green-500">{m.total_catalog}</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico 1: Radar de DNA Sônico */}
        <div className="bg-[#0f1115] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xs font-black uppercase text-green-500 mb-6 flex items-center gap-2">
            <Brain size={16} /> DNA Sônico Médio (IA Spotify)
          </h3>
          <Plot
            data={[{
              type: 'scatterpolar',
              r: Object.values(m.audio_dna).map(v => v * 100),
              theta: Object.keys(m.audio_dna).map(k => k.toUpperCase()),
              fill: 'toself',
              fillcolor: 'rgba(0, 156, 59, 0.2)',
              line: { color: '#009c3b' }
            }]}
            layout={{ ...darkLayout, polar: { radialaxis: { visible: true, range: [0, 100], gridcolor: '#222' }, bgcolor: 'transparent' } }}
            config={{ displayModeBar: false }}
            style={{ width: '100%', height: '350px' }}
          />
        </div>

        {/* Gráfico 2: Atividade Temporal */}
        <div className="bg-[#0f1115] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
            <BarChart size={16} /> Engajamento (7 Dias)
          </h3>
          <Plot
            data={[{
              x: m.daily_activity.map(d => d.day),
              y: m.daily_activity.map(d => d.count),
              type: 'scatter',
              mode: 'lines+markers',
              line: { color: '#009c3b', shape: 'spline' },
              marker: { color: '#ffdf00' }
            }]}
            layout={{ ...darkLayout, xaxis: { gridcolor: '#1a1a1a' }, yaxis: { gridcolor: '#1a1a1a' } }}
            config={{ displayModeBar: false }}
            style={{ width: '100%', height: '350px' }}
          />
        </div>

        {/* Gráfico 3: Gêneros Dominantes */}
        <div className="bg-[#0f1115] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
            <PieChart size={16} /> Mix de Gêneros (Semantic Tags)
          </h3>
          <Plot
            data={[{
              values: Object.values(m.genre_dist),
              labels: Object.keys(m.genre_dist),
              type: 'pie',
              hole: 0.6,
              marker: { colors: ['#009c3b', '#006b28', '#ffdf00', '#1a1a1a'] }
            }]}
            layout={darkLayout}
            config={{ displayModeBar: false }}
            style={{ width: '100%', height: '350px' }}
          />
        </div>

        {/* Lista: Top Curadores */}
        <div className="bg-[#0f1115] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <h3 className="text-xs font-black uppercase text-green-500 mb-8 italic">Top Scouts da Comunidade</h3>
          <div className="space-y-6">
            {m.top_scouts.map((s, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-black text-slate-500 group-hover:bg-green-600 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <span className="font-bold text-slate-200">u/{s.username}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${(s.total_score / m.top_scouts[0].total_score) * 100}%` }}></div>
                   </div>
                   <span className="text-[10px] font-black text-green-500">{s.total_score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
