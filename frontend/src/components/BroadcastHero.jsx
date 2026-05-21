import { motion } from "framer-motion"
import { ArrowRight, CircleDollarSign, ShieldHalf, Zap } from "lucide-react"

function TickerItem({ label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-sm backdrop-blur-xl">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

export default function BroadcastHero({
  heroStats,
  onScrollToInsights,
  season,
  theme,
  tickerItems,
  topTeam,
}) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${theme.accent}22, transparent 26%), radial-gradient(circle at 80% 12%, ${theme.secondary}18, transparent 24%), linear-gradient(135deg, rgba(2,6,23,0.92), rgba(15,23,42,0.72))`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-2rem] top-8 h-28 w-28 rounded-full blur-3xl"
          style={{ background: `${theme.accent}33` }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-2 top-24 h-32 w-32 rounded-full blur-3xl"
          style={{ background: `${theme.secondary}2b` }}
        />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-200">
            <Zap className="h-3.5 w-3.5" />
            Real-Time Cricket Intelligence Platform
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-100/70">
              Season {season}
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              IPL Cricket Analytics Dashboard
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A premium sports-broadcast command center with live IPL energy, neon
              glass panels, and immersive analytics built for presentations, portfolio
              demos, and storytelling.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-300">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToInsights}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Explore insights
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
              <ShieldHalf className="h-4 w-4 text-cyan-200" />
              Theme: {theme.label}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">
              <CircleDollarSign className="h-4 w-4 text-emerald-200" />
              Broadcast mode active
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 mx-auto h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-cyan-400/10 via-transparent to-emerald-400/10 blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="relative flex h-[21rem] w-[21rem] items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_36%,rgba(255,255,255,0.02)_60%,rgba(0,0,0,0.25)_100%)] shadow-[0_0_120px_rgba(34,211,238,0.18)]"
          >
            <div className="absolute inset-10 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.9),rgba(8,15,32,0.98))]" />
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/95 via-slate-100 to-slate-300 shadow-[0_0_70px_rgba(255,255,255,0.18)]"
            >
              <div className="absolute inset-4 rounded-full border border-slate-400/40" />
              <div className="absolute h-20 w-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.02)_72%)]" />
              <div
                className="absolute h-24 w-24 rounded-full border border-transparent"
                style={{
                  boxShadow: `0 0 30px ${theme.accent}66`,
                }}
              />
            </motion.div>
            <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="absolute inset-x-16 bottom-12 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
            <div className="absolute left-6 top-12 h-20 w-20 rounded-full border border-white/10 bg-white/5 blur-sm" />
            <div className="absolute right-6 bottom-12 h-20 w-20 rounded-full border border-white/10 bg-white/5 blur-sm" />
            <div className="absolute bottom-7 left-1/2 h-16 w-36 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-2xl" />
          </motion.div>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(255,255,255,0.04))]" />
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex w-max items-center gap-3 whitespace-nowrap"
          >
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <TickerItem
                key={`${item.label}-${index}`}
                label={item.label}
                value={item.value}
                tone={item.tone}
              />
            ))}
          </motion.div>
        </div>
        <p className="relative mt-3 text-xs uppercase tracking-[0.34em] text-slate-500">
          Live score style ticker
        </p>
      </div>

      {topTeam ? (
        <div className="relative mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-100">
            Table leader: {topTeam.team}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            Win rate: {topTeam.win_percentage}%
          </span>
        </div>
      ) : null}
    </section>
  )
}
