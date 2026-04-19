import { useState } from 'react';
import { ArrowBigUp, MessageSquare } from 'lucide-react';
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

  const replyMutation = useMutation({
    mutationFn: (payload) => axios.post(`/posts/${postId}/comments`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setIsReplying(false);
      setReplyText('');
    },
    onError: (err) => alert(err.response?.data?.detail || "Erro ao responder")
  });

  return (
    <div className="flex gap-3 mt-4 border-l-2 border-white/5 pl-4 ml-1">
      <div className="flex flex-col items-center">
        <button 
          onClick={() => voteMutation.mutate()}
          className={`p-1 rounded ${comment.voted ? 'text-green-500 bg-green-500/10' : 'text-slate-600'}`}
        >
          <ArrowBigUp size={20} fill={comment.voted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-green-500 uppercase">u/{comment.author_username}</span>
          <span className="text-[8px] font-bold text-slate-600">{comment.created_at}</span>
        </div>
        <p className="text-sm text-slate-300 mb-2">{comment.text}</p>
        
        <div className="flex gap-4">
          <button onClick={() => setIsReplying(!isReplying)} className="text-[9px] font-black uppercase text-slate-500 hover:text-white">Responder</button>
          <span className="text-[9px] font-black text-slate-700">{comment.score} pts</span>
        </div>

        {isReplying && (
          <div className="mt-3 flex gap-2">
            <input 
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 p-2 rounded-xl text-xs outline-none focus:border-green-500"
              placeholder="Sua resposta..."
            />
            <button 
              onClick={() => replyMutation.mutate({ text: replyText, parent_id: comment.id })}
              className="bg-green-600 text-white px-3 py-1 rounded-xl text-[10px] font-black"
            >
              OK
            </button>
          </div>
        )}

        {replies.map(r => (
          <CommentNode key={r.id} comment={r} allComments={allComments} postId={postId} user={user} />
        ))}
      </div>
    </div>
  );
}
