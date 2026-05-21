import { motion } from "framer-motion"

export default function GlassPanel({
  action,
  children,
  className = "",
  description,
  title,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
      {(title || description || action) && (
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            {description ? (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                {description}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      <div className="relative mt-5">{children}</div>
    </motion.section>
  )
}
