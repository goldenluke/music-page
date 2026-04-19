import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Send } from 'lucide-react';
import CommentNode from './CommentNode';

export default function Comments({ postId, user }) {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => axios.get(`/posts/${postId}/comments`).then(res => res.data),
  });

  const commentMutation = useMutation({
    mutationFn: (payload) => axios.post(`/posts/${postId}/comments`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setText('');
    },
    onError: (err) => alert(err.response?.data?.detail || "Erro ao comentar")
  });

  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <div className="space-y-8">
      <div className="relative">
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? "O que você achou dessa track?" : "Faça login para comentar"}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-sm outline-none focus:border-green-500 h-24 resize-none"
        />
        <button 
          onClick={() => text.trim() && commentMutation.mutate({ text, parent_id: null })}
          className="absolute right-4 bottom-4 bg-green-600 p-3 rounded-2xl text-white hover:bg-green-500 transition-all"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="pb-10">
        {rootComments.map(c => (
          <CommentNode key={c.id} comment={c} allComments={comments} postId={postId} user={user} />
        ))}
      </div>
    </div>
  );
}
