import { useEffect, useState } from "react";

export function useArtist(slug) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      try {
        const res = await fetch(`/api/artists/${slug}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar artista", err);
      }
    }

    load();
  }, [slug]);

  return data;
}
