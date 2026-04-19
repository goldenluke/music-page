import { useState } from "react";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  async function handleChange(e) {
    const value = e.target.value;
    setQ(value);

    if (value.length < 2) return;

    const res = await fetch(`/api/autocomplete?q=${value}`);
    const data = await res.json();
    setSuggestions(data);
  }

  return (
    <div>
      <input
        value={q}
        onChange={handleChange}
        placeholder="Buscar música..."
      />

      <ul>
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
