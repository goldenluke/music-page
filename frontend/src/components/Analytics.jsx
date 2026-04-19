import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Plot from "react-plotly.js"
import "./analytics.css"

const API = "http://127.0.0.1:3001/api"

export default function Analytics() {
  const navigate = useNavigate();

  const [data, setData] = useState(null)
  const [trends, setTrends] = useState([])

  useEffect(() => {
    axios.get(`${API}/analytics?days=7`)
    .then(res => setData(res.data))
    .catch(err => console.error("analytics error:", err))

    axios.get(`${API}/trends`)
    .then(res => setTrends(res.data))
    .catch(err => console.error("trends error:", err))
  }, [])

  if (!data) {
    return <div className="analytics-container">carregando...</div>
  }

  // timeline mock (até backend ter série real)
  const timeline = Array.from({ length: 7 }).map((_, i) => ({
    day: `D${i + 1}`,
    events: Math.floor(Math.random() * (data.total_events || 10))
  }))

  return (
    <div className="analytics-container">

    {/* HEADER */}
    <div className="analytics-header">
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← Voltar
        </button>

    <div className="analytics-title-main">Analytics</div>
    </div>

    {/* INSIGHTS */}
    <div className="analytics-section">
    <h3>Insights</h3>

    {trends.length === 0 && (
      <div style={{ opacity: 0.6 }}>Nenhum insight ainda...</div>
    )}

    {trends.map((t, i) => (
      <div
      key={i}
      style={{
        background: "rgba(255,255,255,0.05)",
                           padding: 10,
                           borderRadius: 8,
                           marginBottom: 8
      }}
      >
      {t}
      </div>
    ))}
    </div>

    {/* CARDS */}
    <div className="analytics-grid">
    <Card title="Posts" value={data.total_posts} />
    <Card title="Users" value={data.total_users} />
    <Card title="Events" value={data.total_events} />
    </div>

    {/* TIMELINE */}
    <div className="analytics-section">
    <h3>Activity</h3>
    <div className="analytics-chart-box">
    <Plot
    data={[
      {
        x: timeline.map(t => t.day),
          y: timeline.map(t => t.events),
          type: "scatter",
          mode: "lines",
          line: { shape: "spline" }
      }
    ]}
    layout={{
      autosize: true,
      margin: { t: 10, l: 30, r: 10, b: 30 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "inherit" }
    }}
    useResizeHandler
    style={{ width: "100%" }}
    />
    </div>
    </div>

    {/* GRID */}
    <div className="analytics-row">

    {/* GENRES */}
    <div className="analytics-section">
    <h3>Top Genres</h3>
    <div className="analytics-chart-box">
    <Plot
    data={[
      {
        x: data.top_genres.map(g => g.name),
          y: data.top_genres.map(g => g.count),
          type: "bar"
      }
    ]}
    layout={{
      autosize: true,
      margin: { t: 10 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "inherit" }
    }}
    useResizeHandler
    style={{ width: "100%" }}
    />
    </div>
    </div>

    {/* SUBS */}
    <div className="analytics-section">
    <h3>Top Communities</h3>
    <div className="analytics-chart-box">
    <Plot
    data={[
      {
        x: data.top_subs.map(s => s.name),
          y: data.top_subs.map(s => s.count),
          type: "bar"
      }
    ]}
    layout={{
      autosize: true,
      margin: { t: 10 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "inherit" }
    }}
    useResizeHandler
    style={{ width: "100%" }}
    />
    </div>
    </div>

    </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="analytics-card">
    <div className="analytics-title">{title}</div>
    <div className="analytics-value">{value}</div>
    </div>
  )
}
