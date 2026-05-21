import {
  CircleDollarSign,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

export default function Topbar({
  activeTitle,
  collapsed,
  onMenuClick,
  onToggleCollapse,
  onThemeChange,
  season,
  onSeasonChange,
  seasonOptions,
  theme,
  themeOptions,
  title,
  sectionTitle,
}) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl"
      style={{
        boxShadow: `0 12px 60px ${theme.accent}14`,
      }}
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100"
              style={{
                borderColor: `${theme.accent}33`,
                backgroundColor: `${theme.accent}14`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {sectionTitle ?? activeTitle}
            </div>
            <h1
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Premium cricket intelligence with match trends, venue profiles, toss
              outcomes, and winning patterns.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Season
            </span>
            <div className="relative">
              <select
                value={season}
                onChange={(event) => onSeasonChange(event.target.value)}
                className="appearance-none rounded-xl border border-white/10 bg-slate-950/60 py-2 pl-3 pr-9 text-sm font-medium text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15"
              >
                {seasonOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-950">
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Broadcast
            </span>
            <div className="relative">
              <select
                value={theme.key}
                onChange={(event) => onThemeChange(event.target.value)}
                className="appearance-none rounded-xl border border-white/10 bg-slate-950/60 py-2 pl-3 pr-9 text-sm font-medium text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-950">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <CircleDollarSign className="h-4 w-4 text-cyan-200" />
          </label>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:bg-white/10 lg:inline-flex"
          >
            {collapsed ? (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                Expand sidebar
              </>
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Collapse sidebar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
