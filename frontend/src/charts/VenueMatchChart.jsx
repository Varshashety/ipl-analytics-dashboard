import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import GlassPanel from "../components/GlassPanel"
import ChartTooltip from "./ChartTooltip"

export default function VenueMatchChart({ data }) {
  return (
    <GlassPanel
      description="Venue analytics"
      title="Venue Match Count Line Chart"
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 36 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
            <XAxis
              dataKey="venue"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
              interval={0}
              angle={-22}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.25)" }}
            />
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${Number(value).toLocaleString()} matches`} />} />
            <Line
              type="monotone"
              dataKey="total_matches"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#0f172a" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}
