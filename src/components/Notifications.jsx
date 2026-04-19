import { useNotifications } from "../hooks/useNotifications";

export default function Notifications() {
  const { notifications, markAllRead } = useNotifications();

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <h3>🔔 Notificações ({unread})</h3>

      <button onClick={markAllRead}>
        Marcar tudo como lido
      </button>

      {notifications.map(n => (
        <div key={n.id} style={{ marginTop: 10 }}>
          <p>
            <b>{n.actor_username}</b> {n.notification_type} em <i>{n.post_title}</i>
          </p>
          <small>{n.created_at}</small>
        </div>
      ))}
    </div>
  );
}
