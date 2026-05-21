import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import GlassPanel from "../components/GlassPanel"
import ChartTooltip from "./ChartTooltip"

const COLORS = ["#22d3ee", "#38bdf8", "#10b981", "#84cc16", "#f59e0b", "#a855f7"]

export default function TeamWinRateChart({ data }) {
  return (
    <GlassPanel
      description="Team performance"
      title="Team Win Rate Bar Chart"
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 36 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="team"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              interval={0}
              angle={-22}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${Number(value).toFixed(2)}%`} />} />
            <Bar dataKey="win_percentage" radius={[14, 14, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={entry.team ?? index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}
