export async function track(postId, type) {
  try {
    await fetch(`/api/events?post_id=${postId}&event_type=${type}`, {
      method: "POST",
      credentials: "include"
    });
  } catch (err) {
    console.error("Erro tracking", err);
  }
}
