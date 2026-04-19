import { useArtist } from "../hooks/useArtist";

export default function Artist({ slug, goToArtist }) {
  const data = useArtist(slug);

  if (!data) return <p>Carregando artista...</p>;

  return (
    <div>
      <h1>🎤 {data.artist.name}</h1>

      <h3>Gêneros</h3>
      <p>{data.genres.join(", ")}</p>

      <h3>Top Posts</h3>
      {data.posts.map(p => (
        <div key={p.id}>
          <p>{p.title} (⭐ {p.score})</p>
        </div>
      ))}

      <h3>Artistas Relacionados</h3>
      {data.related_artists.map(a => (
        <button key={a.slug} onClick={() => goToArtist(a.slug)}>
          {a.name}
        </button>
      ))}
    </div>
  );
}
