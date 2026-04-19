import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowBigUp, Play, Activity } from 'lucide-react'

export default function MusicCard({ post }) {
  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/post/${post.id}`)}
      className="group bg-[#0f1115] border border-white/5 rounded-[32px] p-6 mb-4 hover:border-green-500/30 transition-all cursor-pointer shadow-2xl"
    >
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-1" onClick={e => e.stopPropagation()}>
          <button className="text-slate-600 hover:text-green-500 transition-colors"><ArrowBigUp size={30}/></button>
          <span className="text-xs font-black text-slate-500">{post.score}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>u/{post.author_username}</span>
            <span className="text-green-500">s/{post.sub_slug}</span>
          </div>
          <h3 className="text-xl font-black text-white mb-4 truncate group-hover:text-green-500 transition-colors">{post.title}</h3>
          
          <div className="relative rounded-2xl overflow-hidden h-32 bg-black/40 border border-white/5">
            <img src={post.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800'} className="w-full h-full object-cover opacity-50" alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Play size={24} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
