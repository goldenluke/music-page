import axios from "axios"
import { useEffect, useState } from "react"

const API = "http://127.0.0.1:3001/api"

export default function EventModal({ eventId, onClose }) {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if (!eventId) return
    axios.get(`${API}/events/${eventId}`)
      .then(res => setEvent(res.data))
  }, [eventId])

  if (!eventId) return null

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        width: 420
      }}>
        {!event ? (
          <p>Carregando...</p>
        ) : (
          <>
            <h2>{event.title}</h2>
            <p>📍 {event.city}</p>
            <p>📅 {new Date(event.date).toLocaleString()}</p>
            <p>🎧 {event.genre}</p>

            <button
              onClick={async () => {
                await axios.post(`${API}/events/${eventId}/going`)
                alert("🔥 Você vai!")
              }}
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                background: "#1db954",
                border: "none",
                color: "white"
              }}
            >
              Vou 🔥
            </button>

            <button
              onClick={onClose}
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                background: "#333",
                border: "none",
                color: "white"
              }}
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
