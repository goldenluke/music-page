import HybridPlayer from "./components/HybridPlayer";
import Player from "./components/Player";
import SearchBox from "./components/SearchBox";
import { useState } from "react";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Notifications from "./components/Notifications";
import Artist from "./pages/Artist";
import Analytics from "./pages/Analytics";

function App() {
  const [page, setPage] = useState("feed");
  const [artistSlug, setArtistSlug] = useState(null);

  function goToArtist(slug) {
    setArtistSlug(slug);
    setPage("artist");
  }

  return (
      <HybridPlayer />
      <Player />
      <SearchBox />
    <div>
      <button onClick={() => setPage("feed")}>Feed</button>
      <button onClick={() => setPage("create")}>Criar Post</button>
      <button onClick={() => setPage("notifications")}>🔔 Notificações</button>
      <button onClick={() => setPage("analytics")}>📊 Analytics</button>

      {page === "feed" && <Feed goToArtist={goToArtist} />}
      {page === "create" && <CreatePost />}
      {page === "notifications" && <Notifications />}
      {page === "artist" && <Artist slug={artistSlug} goToArtist={goToArtist} />}
      {page === "analytics" && <Analytics />}
    </div>
  );
}

export default App;
