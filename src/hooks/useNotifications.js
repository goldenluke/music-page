import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  async function fetchNotifications() {
    try {
      const data = await apiFetch("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Erro ao carregar notificações", err);
    }
  }

  async function markAllRead() {
    try {
      await apiFetch("/notifications/read-all", {
        method: "POST"
      });
      fetchNotifications();
    } catch (err) {
      console.error("Erro ao marcar como lido", err);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, refresh: fetchNotifications, markAllRead };
}
