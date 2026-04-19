import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";

export default function Feed({ goToArtist }) {
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState("latest");
  const [group, setGroup] = useState(null);

  async function fetchPosts() {
    let url = "/api/posts?sort=latest";

    if (mode === "top") url = "/api/posts?sort=top";
    if (mode === "trending") url = "/api/posts?sort=trending";
    if (mode === "personalized") url = "/api/feed/personalized";
    if (mode === "hybrid") url = "/api/feed/hybrid";
    if (mode === "recommended") url = "/api/feed/recommended";

    if (mode === "ab") {
      const res = await fetch("/api/feed/ab", {
        credentials: "include"
      });
      const data = await res.json();
      setPosts(data.posts);
      setGroup(data.group);
      return;
    }

    const res = await fetch(url, {
      credentials: "include"
    });

    const data = await res.json();
    setPosts(data);
    setGroup(null);
  }

  useEffect(() => {
    fetchPosts();
  }, [mode]);

  return (
    <div>
      <h1>Feed</h1>

      {group && <p>🧪 Grupo: {group}</p>}

      <button onClick={() => setMode("latest")}>🆕 Latest</button>
      <button onClick={() => setMode("top")}>⭐ Top</button>
      <button onClick={() => setMode("trending")}>🔥 Trending</button>
      <button onClick={() => setMode("personalized")}>🧠 For You</button>
      <button onClick={() => setMode("hybrid")}>⚡ Smart Feed</button>
      <button onClick={() => setMode("recommended")}>🚀 Recommended</button>
      <button onClick={() => setMode("ab")}>🧪 A/B Test</button>

      {posts.map(post => (
        <PostCard key={post.id} post={post} goToArtist={goToArtist} />
      ))}
    </div>
  );
}
