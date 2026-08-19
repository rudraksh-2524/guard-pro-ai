import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionTitle, StatCard } from "@/components/common/states";
import { DemoBadge, RiskBadge } from "@/components/common/badges";
import { DEMO_EXAM_ID } from "@/constants";
import { demoExams, demoSessions, studentRecentActivity } from "@/lib/demo-data";
import { formatDateTime, formatDuration, relativeTime } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { riskLevelFor } from "@/services/risk-engine";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/student/dashboard")({
  head: () =>
    pageHead(
      "Candidate dashboard — Proctor Guard AI",
      "Your upcoming assessments, recent attempts and proctoring summary in one place.",
    ),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { session } = useAuth();
  const upcoming = demoExams.filter((e) => e.status === "published").slice(0, 3);
  const attempts = demoSessions;
  const avgScore = Math.round(attempts.reduce((s, a) => s + a.score, 0) / Math.max(attempts.length, 1));
  const avgRisk = Math.round(
    attempts.reduce((s, a) => s + a.final_risk_score, 0) / Math.max(attempts.length, 1),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${session?.user.full_name ?? "candidate"}`}
        description="Review your assessments and integrity summary before your next attempt."
        actions={
          <Button asChild>
            <Link to="/student/demo-quiz">Start demo quiz</Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attempts completed" value={attempts.length} hint="All-time submitted sessions" />
        <StatCard label="Average score" value={`${avgScore}%`} tone="success" hint="Across submitted attempts" />
        <StatCard
          label="Average risk"
          value={avgRisk}
          tone={avgRisk > 60 ? "danger" : avgRisk > 30 ? "warning" : "success"}
          hint="Proctoring risk index"
        />
        <StatCard label="Assessments available" value={upcoming.length} hint="Published and open" />
      </div>

      <section>
        <SectionTitle aside={<Link to="/student/exams" className="text-xs text-primary hover:underline">View all</Link>}>
          Available assessments
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-3">
          {upcoming.map((exam) => (
            <article key={exam.id} className="panel flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{exam.title}</h3>
                {exam.id === DEMO_EXAM_ID && <DemoBadge />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{exam.subject}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{exam.description}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-mono text-foreground">{exam.duration_minutes} min</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Questions</dt>
                  <dd className="font-mono text-foreground">{exam.total_questions}</dd>
                </div>
              </dl>
              <Button asChild size="sm" className="mt-3">
                <Link to="/exam/$examId/system-check" params={{ examId: exam.id }}>
                  Begin system check
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <SectionTitle>Recent attempts</SectionTitle>
          <div className="panel divide-y divide-border">
            {attempts.map((a) => {
              const exam = demoExams.find((e) => e.id === a.exam_id);
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{exam?.title ?? a.exam_id}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.submitted_at ? formatDateTime(a.submitted_at) : "—"} ·{" "}
                      {formatDuration(a.time_spent_seconds)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-sm text-foreground">{a.score}%</span>
                    <RiskBadge level={riskLevelFor(a.final_risk_score)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <SectionTitle aside={<DemoBadge />}>Activity log</SectionTitle>
          <ul className="panel divide-y divide-border">
            {studentRecentActivity.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="text-foreground">{item.label}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{relativeTime(item.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}