import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { averageRiskTrend, eventsOverTime, riskDistribution, examParticipation } from "@/lib/demo-data";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
};

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  fontSize: 12,
  color: "var(--foreground)",
};

const riskColors = ["var(--success)", "var(--warning)", "var(--destructive)", "var(--destructive)"];

export function RiskDistributionChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={riskDistribution}
            dataKey="value"
            nameKey="label"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            stroke="var(--card)"
          >
            {riskDistribution.map((entry, i) => (
              <Cell key={entry.label} fill={riskColors[i % riskColors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {riskDistribution.map((entry, i) => (
          <li key={entry.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: riskColors[i % riskColors.length] }}
              aria-hidden="true"
            />
            {entry.label} ({entry.value})
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EventsOverTimeChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={eventsOverTime}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" {...axis} tickLine={false} />
          <YAxis {...axis} tickLine={false} width={28} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--primary)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AverageRiskChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={averageRiskTrend}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" {...axis} tickLine={false} />
          <YAxis {...axis} tickLine={false} width={28} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.18}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ParticipationChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={examParticipation} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis type="number" {...axis} tickLine={false} />
          <YAxis type="category" dataKey="label" {...axis} tickLine={false} width={120} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="var(--primary)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}