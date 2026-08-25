import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SectionTitle, StatCard } from "@/components/common/states";
import { DemoBadge, RiskBadge, SeverityBadge, StatusPill } from "@/components/common/badges";
import { RiskMeter } from "@/components/proctoring/risk-meter";
import { EventTimeline } from "@/components/proctoring/event-timeline";
import { demoLiveSessions, demoLiveTimelines } from "@/lib/demo-data";
import { formatClock, formatDuration, relativeTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/sessions/$sessionId")({
  loader: ({ params }) => {
    const session = demoLiveSessions.find((s) => s.session_id === params.sessionId);
    if (!session) throw notFound();
    return { sessionId: session.session_id };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Session not found — Proctor Guard AI" }, { name: "robots", content: "noindex" }] };
    }
    return pageHead(
      `Session ${loaderData.sessionId} — Proctor Guard AI`,
      "Full proctoring review for a supervised examination session, including the signal timeline.",
    );
  },
  notFoundComponent: SessionNotFound,
  component: SessionReview,
});

function SessionNotFound() {
  const { sessionId } = Route.useParams();
  return (
    <div className="panel p-8 text-center">
      <h1 className="text-base font-semibold text-foreground">Session {sessionId} not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It may have ended or been removed from the monitoring board.
      </p>
      <Button asChild className="mt-4">
        <Link to="/admin/monitoring">Back to live monitoring</Link>
      </Button>
    </div>
  );
}

function SessionReview() {
  const { sessionId } = Route.useLoaderData();
  const session = demoLiveSessions.find((s) => s.session_id === sessionId)!;
  const events = demoLiveTimelines[sessionId] ?? [];
  const highSeverity = events.filter((e) => e.severity === "high").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={session.student_name}
        description={`${session.student_code} · ${session.exam_title}`}
        actions={
          <>
            <DemoBadge label="Sample session" />
            <Button size="sm" variant="outline" asChild>
              <Link to="/admin/monitoring">Back to board</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Risk score" value={session.risk_score} tone={session.risk_score > 60 ? "danger" : "default"} />
        <StatCard label="Signals recorded" value={events.length} />
        <StatCard label="High severity" value={highSeverity} tone={highSeverity ? "danger" : "success"} />
        <StatCard label="Elapsed" value={formatDuration(session.duration_seconds)} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="panel p-4">
            <SectionTitle>Integrity</SectionTitle>
            <RiskMeter score={session.risk_score} />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Level</span>
              <RiskBadge level={session.risk_level} />
            </div>
          </div>

          <div className="panel space-y-2.5 p-4">
            <SectionTitle>Device state</SectionTitle>
            <StatusPill tone={session.camera === "connected" ? "ok" : "bad"} label={`Camera ${session.camera}`} />
            <StatusPill
              tone={session.monitoring === "active" ? "ok" : "warn"}
              label={`Monitoring ${session.monitoring}`}
            />
            <StatusPill tone="neutral" label={`Progress ${session.progress}%`} />
            <StatusPill tone="neutral" label={`Updated ${relativeTime(session.last_activity)}`} />
          </div>

          <div className="panel p-4">
            <SectionTitle>Examiner action</SectionTitle>
            <Textarea
              placeholder="Add a review note for this session…"
              className="min-h-24"
              aria-label="Examiner note"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => toast.success("Review note recorded")}>
                Save note
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Candidate warned", { description: "A warning was queued for delivery." })}
              >
                Warn candidate
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => toast.error("Session termination requested")}
              >
                Terminate
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Actions are simulated in this demonstration and never affect a real candidate.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <SectionTitle aside={<span className="text-xs text-muted-foreground">{events.length} entries</span>}>
              Signal timeline
            </SectionTitle>
            <EventTimeline events={events} />
          </div>

          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Signal detail
              </caption>
              <thead>
                <tr className="border-y border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-2.5 font-medium">Time</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Signal</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Severity</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Impact</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Score after</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {formatClock(e.created_at)}
                    </td>
                    <td className="px-4 py-2.5 text-foreground">{e.description}</td>
                    <td className="px-4 py-2.5">
                      <SeverityBadge severity={e.severity} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground">
                      {e.risk_impact > 0 ? `+${e.risk_impact}` : e.risk_impact}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground">{e.risk_score_after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
