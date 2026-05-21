function formatNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return value
  }

  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2)
}

export default function AnalyticsTooltip({
  active,
  payload,
  label,
  valueFormatter,
}) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0]
  const value = valueFormatter ? valueFormatter(item.value, item.name) : formatNumber(item.value)

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-300">
        {item.name}
      </p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  )
}
