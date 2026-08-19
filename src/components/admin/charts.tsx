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

export function RiskDistributionChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={riskDistribution}
            dataKey="sessions"
            nameKey="level"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            stroke="var(--card)"
          >
            {riskDistribution.map((entry) => (
              <Cell key={entry.level} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {riskDistribution.map((entry) => (
          <li key={entry.level} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} aria-hidden="true" />
            {entry.level} ({entry.sessions})
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
          <XAxis dataKey="time" {...axis} tickLine={false} />
          <YAxis {...axis} tickLine={false} width={28} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="events" name="Events" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="high_severity" name="High severity" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
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
          <XAxis dataKey="day" {...axis} tickLine={false} />
          <YAxis {...axis} tickLine={false} width={28} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="average_risk"
            name="Average risk"
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
          <YAxis type="category" dataKey="exam" {...axis} tickLine={false} width={110} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="enrolled" name="Enrolled" fill="var(--color-chart-3)" radius={[0, 3, 3, 0]} />
          <Bar dataKey="attempted" name="Attempted" fill="var(--color-chart-1)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}