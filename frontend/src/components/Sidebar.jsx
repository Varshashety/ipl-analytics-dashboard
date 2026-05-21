import { motion } from "framer-motion"

export default function Sidebar({
  activeSection,
  collapsed,
  items,
  mobileOpen,
  onSelect,
  onClose,
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: mobileOpen ? 0 : 0 }}
      className={[
        "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/10 bg-slate-950/90 backdrop-blur-2xl transition-all duration-300",
        collapsed ? "lg:w-24" : "lg:w-72",
        mobileOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col px-4 py-5">
        <div className="flex items-center justify-between gap-3 px-2">
          <button
            type="button"
            onClick={() => onSelect("dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-lg font-black text-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.28)]">
              IPL
            </span>
            {!collapsed || mobileOpen ? (
              <span>
                <span className="block text-lg font-semibold tracking-wide text-white">
                  IPL Pulse
                </span>
                <span className="block text-xs uppercase tracking-[0.34em] text-slate-400">
                  Analytics suite
                </span>
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
          >
            Close
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const active = activeSection === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={[
                  "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                  active
                    ? "border-cyan-400/30 bg-cyan-400/10 text-white shadow-[0_0_35px_rgba(34,211,238,0.1)]"
                    : "border-transparent bg-white/0 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-current transition",
                    active
                      ? "border-cyan-400/30 bg-cyan-400/15"
                      : "border-white/10 bg-white/5 group-hover:border-cyan-400/20",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!collapsed || mobileOpen ? (
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.description}
                    </span>
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {!collapsed || mobileOpen ? (
          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-emerald-400/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/70">
              Live Mode
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              FastAPI + React + Recharts visualizing IPL team, venue, and toss analytics.
            </p>
          </div>
        ) : null}
      </div>
    </motion.aside>
  )
}
