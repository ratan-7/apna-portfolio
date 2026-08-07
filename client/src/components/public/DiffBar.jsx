export default function DiffBar({ additions, deletions }) {
  const total = additions + deletions;
  const addPct = Math.round((additions / total) * 100);

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="text-emerald-400">+{additions}</span>
      <span className="text-rose-400">-{deletions}</span>
      <div
        className="flex h-2 w-24 overflow-hidden rounded-sm"
        style={{ backgroundColor: "var(--card-border-strong)" }}
      >
        <div className="h-full bg-emerald-500" style={{ width: `${addPct}%` }} />
        <div className="h-full bg-rose-500" style={{ width: `${100 - addPct}%` }} />
      </div>
    </div>
  );
}
