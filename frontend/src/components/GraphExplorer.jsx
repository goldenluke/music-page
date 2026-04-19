import { useState } from "react";
import { apiGet } from "../api/api";

export default function GraphExplorer() {
  const [node, setNode] = useState("techno");
  const [data, setData] = useState([]);

  async function load() {
    const res = await apiGet(`/graph?node=${node}`);
    setData(res);
  }

  return (
    <div>
      <h2>🔗 Grafo Musical</h2>

      <input value={node} onChange={(e) => setNode(e.target.value)} />
      <button onClick={load}>Explorar</button>

      <ul>
        {data.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}
