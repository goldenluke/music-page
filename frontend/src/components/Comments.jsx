import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Send, User as UserIcon } from 'lucide-react';

export default function Comments({ postId, user }) {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  // Busca os comentários do post
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => axios.get(`http://localhost:8000/api/posts/${postId}/comments`).then(res => res.data),
  });

  // Mutação para criar comentário
  const mutation = useMutation({
    mutationFn: (newComment) => axios.post(`http://localhost:8000/api/posts/${postId}/comments`, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setText('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate({ text });
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-6 animate-in fade-in slide-in-from-top-2">
      
      {/* Formulário (só se logado) */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua opinião..."
            className="flex-1 bg-black border border-white/10 p-2 px-4 rounded-xl text-xs outline-none focus:border-blue-500 transition-all"
          />
          <button 
            disabled={mutation.isPending}
            className="bg-blue-600 p-2 px-4 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </form>
      ) : (
        <p className="text-[10px] text-slate-500 font-bold uppercase text-center py-2">Faça login para comentar</p>
      )}

      {/* Lista de Comentários */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-4 animate-pulse text-slate-600 text-[10px] font-bold uppercase">Carregando...</div>
        ) : comments?.length > 0 ? (
          comments.map(c => (
            <div key={c.id} className="flex gap-3 items-start group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                <UserIcon size={14} className="text-slate-500" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-blue-500 uppercase tracking-tight">{c.author_username}</span>
                  <span className="text-[9px] font-bold text-slate-600 uppercase italic">Agora mesmo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-slate-600 text-[10px] font-bold uppercase italic">Ninguém falou nada ainda...</p>
        )}
      </div>
    </div>
  );
}
