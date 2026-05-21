import { motion } from "framer-motion"

const ACCENTS = [
  {
    border: "from-cyan-400/60 to-sky-500/60",
    chip: "bg-cyan-400/15 text-cyan-100",
    fill: "from-cyan-400 to-sky-500",
  },
  {
    border: "from-emerald-400/60 to-lime-400/60",
    chip: "bg-emerald-400/15 text-emerald-100",
    fill: "from-emerald-400 to-lime-400",
  },
  {
    border: "from-fuchsia-500/60 to-violet-500/60",
    chip: "bg-fuchsia-400/15 text-fuchsia-100",
    fill: "from-fuchsia-500 to-violet-500",
  },
  {
    border: "from-amber-400/60 to-orange-500/60",
    chip: "bg-amber-400/15 text-amber-100",
    fill: "from-amber-400 to-orange-500",
  },
]

export default function TeamCard({ index, team }) {
  const palette = ACCENTS[index % ACCENTS.length]

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${palette.border} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${palette.chip}`}>
              Team
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{team.team}</h3>
            <p className="mt-2 text-sm text-slate-300">Historic win performance</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Wins</p>
            <p className="mt-1 text-lg font-semibold text-white">{team.wins}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Win percentage</span>
            <span className="font-semibold text-white">{team.win_percentage}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${palette.fill}`}
              style={{ width: `${Math.min(Number(team.win_percentage) || 0, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  )
}
