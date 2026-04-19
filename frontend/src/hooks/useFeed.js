import { useEffect, useState } from "react";
import axios from "axios";

export default function useFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("sub");

    const url = sub
      ? `/api/feed/rl?sub=${sub}`
      : `/api/feed/rl`;

    axios.get(url).then((res) => {
      setPosts(res.data);
    });
  }, [window.location.search]);

  return posts;
}
