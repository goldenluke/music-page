import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Carregando analytics...</p>;

  const eventTypes = data.event_types.map(e => e.event_type);
  const eventCounts = data.event_types.map(e => e.count);

  const postTitles = data.top_posts.map(p => p.title);
  const postCounts = data.top_posts.map(p => p.events);

  const artistNames = data.top_artists.map(a => a.name);
  const artistCounts = data.top_artists.map(a => a.events);

  return (
    <div>
      <h1>📊 Analytics Dashboard</h1>

      <h3>Eventos por Tipo</h3>
      <Plot
        data={[
          {
            x: eventTypes,
            y: eventCounts,
            type: "bar"
          }
        ]}
        layout={{ title: "Eventos" }}
      />

      <h3>Top Posts</h3>
      <Plot
        data={[
          {
            x: postCounts,
            y: postTitles,
            type: "bar",
            orientation: "h"
          }
        ]}
        layout={{ title: "Posts mais engajados" }}
      />

      <h3>Top Artistas</h3>
      <Plot
        data={[
          {
            x: artistCounts,
            y: artistNames,
            type: "bar",
            orientation: "h"
          }
        ]}
        layout={{ title: "Artistas mais engajados" }}
      />
    </div>
  );
}
