import { SearchX } from "lucide-react"
import { motion } from "framer-motion"

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur-xl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  )
}
