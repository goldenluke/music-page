import { ArrowBigUp, MoreHorizontal, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function CommentCard({ comment, postId }) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/api/comments/${comment.id}/vote`),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  return (
    <div className="flex gap-4 group animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Barra de Votos do Comentário */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button 
          onClick={() => voteMutation.mutate()}
          className={`p-1 rounded-lg transition-all ${comment.voted ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-white/10'}`}
        >
          <ArrowBigUp size={18} fill={comment.voted ? "currentColor" : "none"} />
        </button>
        <span className={`text-[10px] font-black ${comment.voted ? 'text-green-500' : 'text-slate-600'}`}>
          {comment.score}
        </span>
      </div>

      {/* Conteúdo do Comentário */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-green-600/20 flex items-center justify-center">
            <User size={10} className="text-green-500" />
          </div>
          <span className="text-[11px] font-black text-green-500 uppercase italic">u/{comment.author_username}</span>
          <span className="text-[9px] font-bold text-slate-600 uppercase">{comment.created_at}</span>
          <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-white">
            <MoreHorizontal size={14} />
          </button>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[20px] rounded-tl-none">
          <p className="text-sm text-slate-300 leading-relaxed font-medium selection:bg-green-500/30">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}
