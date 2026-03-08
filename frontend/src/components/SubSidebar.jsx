import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';

export default function SubSidebar({ subs }) {
  return (
    <div className="bg-[#0f1115] border border-white/5 rounded-[32px] p-6 shadow-xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 italic">Comunidades</h3>
      <div className="space-y-2">
        {subs?.map(sub => (
          <Link 
            key={sub.slug} 
            to={`/s/${sub.slug}`}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Hash size={14} className="text-slate-400 group-hover:text-white" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">s/{sub.slug}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
