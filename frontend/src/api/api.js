export async function apiGet(url) {
  const res = await fetch(`/api${url}`);
  return await res.json();
}
