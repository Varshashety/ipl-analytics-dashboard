import { Search, X } from "lucide-react"

export default function SearchBar({ onChange, onClear, value, totalCount, filteredCount }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search teams, venues, or insights..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-12 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15"
          />
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
          <span>
            Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
