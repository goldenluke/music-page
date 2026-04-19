import { useEffect, useState } from "react";
import axios from "axios";

export default function Subs() {
  const [subs, setSubs] = useState([]);

  const loadSubs = async () => {
    const res = await axios.get("/api/subs");
    setSubs(res.data);
  };

  useEffect(() => {
    loadSubs();
  }, []);

  const createSub = async () => {
    const name = prompt("Nome da comunidade:");
    if (!name) return;

    await axios.post("/api/subs", { name });
    loadSubs();
  };

  return (
    <div>
      <h3>Comunidades</h3>

      <button onClick={createSub}>
        + Criar comunidade
      </button>

      <div
        style={{ cursor: "pointer", marginTop: 10 }}
        onClick={() => (window.location.href = "/")}
      >
        s/ (Feed Geral)
      </div>

      {subs.map((s) => (
        <div
          key={s.slug}
          style={{ cursor: "pointer", marginTop: 6 }}
          onClick={() =>
            (window.location.href = `/?sub=${s.slug}`)
          }
        >
          s/{s.slug} ({s.count})
        </div>
      ))}
    </div>
  );
}
