import { useState } from 'react';
import { ArrowBigUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function CommentNode({ comment, allComments, postId, user }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const replies = allComments.filter(c => c.parent_id === comment.id);

  const voteMutation = useMutation({
    mutationFn: () => axios.post(`/comments/${comment.id}/vote`),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  return (
    <div className="flex gap-3 mt-5 border-l border-white/5 pl-4 ml-1">
      <div className="flex flex-col items-center gap-1">
        <button 
          onClick={() => voteMutation.mutate()}
          className={`p-1 rounded transition-colors ${comment.voted ? 'text-green-500 bg-green-500/10' : 'text-slate-600 hover:bg-white/5'}`}
        >
          <ArrowBigUp size={20} fill={comment.voted ? "currentColor" : "none"} />
        </button>
        
        {/* CONTADOR DE UPVOTES DO COMENTÁRIO */}
        <span className={`text-[10px] font-black ${comment.voted ? 'text-green-500' : 'text-slate-600'}`}>
          {comment.score || 0}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-green-500 uppercase italic">u/{comment.author_username}</span>
          <span className="text-[8px] font-bold text-slate-600">{comment.created_at}</span>
        </div>
        <p className="text-sm text-slate-300 mb-2">{comment.text}</p>
        
        <div className="flex gap-4">
          <button onClick={() => setIsReplying(!isReplying)} className="text-[9px] font-black uppercase text-slate-500 hover:text-white">Responder</button>
        </div>

        {replies.map(r => (
          <CommentNode key={r.id} comment={r} allComments={allComments} postId={postId} user={user} />
        ))}
      </div>
    </div>
  );
}
