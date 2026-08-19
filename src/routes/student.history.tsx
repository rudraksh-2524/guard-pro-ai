import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, StatCard } from "@/components/common/states";
import { RiskBadge } from "@/components/common/badges";
import { demoExams, demoSessions } from "@/lib/demo-data";
import { formatDateTime, formatDuration } from "@/lib/format";
import { riskLevelFor } from "@/services/risk-engine";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/student/history")({
  head: () =>
    pageHead(
      "Exam history — Proctor Guard AI",
      "Every submitted attempt with its score, duration and proctoring risk summary.",
    ),
  component: StudentHistory,
});

function StudentHistory() {
  const sessions = [...demoSessions].sort((a, b) =>
    (b.submitted_at ?? "").localeCompare(a.submitted_at ?? ""),
  );
  const best = sessions.reduce((m, s) => Math.max(m, s.score), 0);
  const events = sessions.reduce((m, s) => m + s.suspicious_event_count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam history"
        description="Scores are reported alongside the proctoring summary recorded during each attempt."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Attempts" value={sessions.length} />
        <StatCard label="Best score" value={`${best}%`} tone="success" />
        <StatCard label="Flagged events" value={events} tone={events > 3 ? "warning" : "default"} />
      </div>

      {sessions.length === 0 ? (
        <EmptyState title="No attempts yet" description="Your submitted assessments will appear here." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Assessment</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Submitted</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Duration</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Correct</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Score</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Risk</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Report</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const exam = demoExams.find((e) => e.id === s.exam_id);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">{exam?.title ?? s.exam_id}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.submitted_at ? formatDateTime(s.submitted_at) : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {formatDuration(s.time_spent_seconds)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {s.correct_count}/{s.attempted_count}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{s.score}%</td>
                    <td className="px-4 py-3">
                      <RiskBadge level={riskLevelFor(s.final_risk_score)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/exam/$examId/result" params={{ examId: s.exam_id }} search={{ session: s.id }}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}