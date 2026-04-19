import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useMeta() {
  const [subs, setSubs] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [subsData, genresData] = await Promise.all([
          apiFetch("/subs"),
          apiFetch("/genres")
        ]);

        setSubs(subsData);
        setGenres(genresData);
      } catch (err) {
        console.error("Erro ao carregar metadados", err);
      }
    }

    load();
  }, []);

  return { subs, genres };
}
