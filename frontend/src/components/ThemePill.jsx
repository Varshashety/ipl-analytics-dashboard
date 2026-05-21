export default function ThemePill({ theme }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: theme.accent }} />
      {theme.label}
    </div>
  )
}
