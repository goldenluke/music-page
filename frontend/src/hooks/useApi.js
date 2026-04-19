import { useState } from "react";

export function useApi(fn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(...args) {
    setLoading(true);
    const res = await fn(...args);
    setData(res);
    setLoading(false);
  }

  return { data, loading, run };
}
