export default function PlayerModal({ post, onClose }) {
  if (!post) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl w-[500px]">

        <button
          className="text-white mb-3"
          onClick={onClose}
        >
          ✖ fechar
        </button>

        <h2 className="text-white text-xl mb-2">{post.title}</h2>

        {/* YOUTUBE */}
        {post.youtube_id && (
          <iframe
            src={`https://www.youtube.com/embed/${post.youtube_id}?autoplay=1`}
            className="w-full h-64"
            allow="autoplay"
          />
        )}

        {/* SPOTIFY PREVIEW */}
        {post.preview_url && (
          <audio controls autoPlay className="w-full mt-3">
            <source src={post.preview_url} />
          </audio>
        )}
      </div>
    </div>
  )
}
