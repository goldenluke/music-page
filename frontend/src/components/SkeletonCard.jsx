export default function SkeletonCard() {
  return (
    <div className="bg-[#0f1115] border border-white/5 rounded-[32px] p-6 flex gap-6 animate-pulse">
      <div className="w-12 h-24 bg-white/5 rounded-2xl" />
      <div className="flex-1 space-y-4 py-2">
        <div className="h-4 bg-white/5 rounded w-1/4" />
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="h-20 bg-white/5 rounded w-full" />
      </div>
    </div>
  );
}
