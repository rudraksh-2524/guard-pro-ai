import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionTitle, StatCard } from "@/components/common/states";
import { DemoBadge, RiskBadge } from "@/components/common/badges";
import { RiskDistributionChart, EventsOverTimeChart, AverageRiskChart } from "@/components/admin/charts";
import { dashboardMetrics, demoLiveSessions, eventCategories } from "@/lib/demo-data";
import { relativeTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/dashboard")({
  head: () =>
    pageHead(
      "Administration dashboard — Proctor Guard AI",
      "Active sessions, risk distribution and proctoring signal trends across your institution.",
    ),
  component: AdminDashboard,
});

function AdminDashboard() {
  const attention = [...demoLiveSessions].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration dashboard"
        description="Institution-wide examination integrity overview."
        actions={
          <>
            <DemoBadge label="Sample data" />
            <Button asChild size="sm">
              <Link to="/admin/monitoring">Live monitoring</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active sessions" value={dashboardMetrics.active_sessions} hint="Currently supervised" />
        <StatCard label="Active exams" value={dashboardMetrics.active_exams} hint="Open assessment windows" />
        <StatCard
          label="Warning level"
          value={dashboardMetrics.warning}
          tone="warning"
          hint="Sessions in the 31–60 band"
        />
        <StatCard
          label="High risk"
          value={dashboardMetrics.high_risk}
          tone="danger"
          hint="Sessions above 80"
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <SectionTitle>Risk distribution</SectionTitle>
          <RiskDistributionChart />
        </div>
        <div className="panel p-4">
          <SectionTitle>Proctoring events per hour</SectionTitle>
          <EventsOverTimeChart />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-4">
          <SectionTitle>Average risk — last 14 days</SectionTitle>
          <AverageRiskChart />
        </div>
        <div className="panel p-4">
          <SectionTitle>Signals by category</SectionTitle>
          <ul className="space-y-2.5">
            {eventCategories.map((c) => (
              <li key={c.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.category}</span>
                  <span className="font-mono text-foreground">{c.count}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.round((c.count / Math.max(...eventCategories.map((e) => e.count))) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionTitle
          aside={
            <Link to="/admin/monitoring" className="text-xs text-primary hover:underline">
              Open monitoring board
            </Link>
          }
        >
          Sessions needing attention
        </SectionTitle>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Candidate</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Assessment</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Latest signal</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Risk</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Level</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Session</th>
              </tr>
            </thead>
            <tbody>
              {attention.map((s) => (
                <tr key={s.session_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="block text-foreground">{s.student_name}</span>
                    <span className="block font-mono text-xs text-muted-foreground">{s.student_code}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.exam_title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.latest_event}
                    <span className="ml-2 text-xs">{relativeTime(s.last_activity)}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{s.risk_score}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={s.risk_level} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/admin/sessions/$sessionId" params={{ sessionId: s.session_id }}>
                        Review
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}