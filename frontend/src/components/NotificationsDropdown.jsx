import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MessageSquare, ArrowBigUp, Check } from 'lucide-react';

export default function NotificationsDropdown({ notifications }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const readMutation = useMutation({
    mutationFn: () => api.post('/api/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  return (
    <div className="absolute right-0 mt-3 w-80 bg-[#0f1115] border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[120] animate-in zoom-in-95 duration-200">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 italic">
          {t('notifications', 'Notificações')}
        </h4>
        <button 
          onClick={() => readMutation.mutate()}
          className="text-slate-500 hover:text-white transition"
          title="Marcar tudo como lido"
        >
          <Check size={16} />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications?.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 border-b border-white/5 flex gap-4 hover:bg-white/5 transition-colors ${!n.is_read ? 'bg-green-600/5' : 'opacity-60'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.notification_type === 'vote' ? 'bg-green-600/20 text-green-500' : 'bg-purple-600/20 text-purple-500'}`}>
                {n.notification_type === 'vote' ? <ArrowBigUp size={18} fill="currentColor"/> : <MessageSquare size={16} />}
              </div>
              <div>
                <p className="text-xs text-slate-200 leading-tight">
                  <span className="font-black text-white">u/{n.actor_username}</span> 
                  {n.notification_type === 'vote' ? ` ${t('notif_vote', 'curtiu sua música')}` : ` ${t('notif_comment', 'comentou no seu post')}`}
                </p>
                <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase italic truncate w-48">
                  "{n.post_title}"
                </p>
              </div>
              {!n.is_read && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0 animate-pulse"></div>}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-600">
            <BellOff className="mx-auto mb-2 opacity-20" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">{t('no_notifs', 'Silêncio por aqui')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
