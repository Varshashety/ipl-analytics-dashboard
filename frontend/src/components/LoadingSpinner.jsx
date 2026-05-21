import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LoadingSpinner({
  label = "Loading dashboard data...",
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-white/5 px-8 py-10 text-center backdrop-blur-xl"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">{label}</h2>
          <p className="mt-2 text-sm text-slate-300">
            Pulling live IPL analytics from the FastAPI backend.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
