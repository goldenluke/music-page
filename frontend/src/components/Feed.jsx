import { useState } from "react"
import EventModal from "./EventModal"
import useFeed from "../hooks/useFeed";

export default function Feed() {
  const posts = useFeed();
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <h4>{p.title}</h4>
          <div>#{p.genre}</div>
          <div>s/{p.sub}</div>
        </div>
      ))}
    </div>
  );
}
