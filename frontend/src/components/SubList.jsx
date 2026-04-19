import { useNavigate } from "react-router-dom";

export default function SubList({ subs }) {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Comunidades</h3>

      <div
        style={{ cursor: "pointer", marginBottom: 10 }}
        onClick={() => navigate("/")}
      >
        s/ (Feed Geral)
      </div>

      {subs.map((s) => (
        <div
          key={s.slug}
          style={{ cursor: "pointer", marginBottom: 6 }}
          onClick={() => navigate(`/?sub=${s.slug}`)}
        >
          s/{s.slug} ({s.count})
        </div>
      ))}
    </div>
  );
}
