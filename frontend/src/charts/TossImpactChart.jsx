import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import GlassPanel from "../components/GlassPanel"
import ChartTooltip from "./ChartTooltip"

const COLORS = ["#22d3ee", "#334155"]

export default function TossImpactChart({ data }) {
  return (
    <GlassPanel
      description="Toss analytics"
      title="Toss Impact Pie Chart"
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${Number(value).toFixed(2)}%`} />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={88}
              outerRadius={128}
              paddingAngle={4}
              startAngle={90}
              endAngle={-270}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name ?? index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span style={{ color: "#cbd5e1" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}
