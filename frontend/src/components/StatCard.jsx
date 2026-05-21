import { motion } from "framer-motion"

export default function StatCard({
  accent,
  detail,
  icon: Icon,
  label,
  value,
}) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-300/80">
            {label}
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-white">{value}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-200/80">{detail}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-[0_0_32px_rgba(255,255,255,0.06)]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.article>
  )
}
