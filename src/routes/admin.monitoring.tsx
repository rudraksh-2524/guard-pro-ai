import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/states";
import { DemoBadge, RiskBadge, StatusPill } from "@/components/common/badges";
import { RiskMeter } from "@/components/proctoring/risk-meter";
import { demoLiveSessions } from "@/lib/demo-data";
import { formatDuration, relativeTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { RiskLevel } from "@/types";

export const Route = createFileRoute("/admin/monitoring")({
  head: () =>
    pageHead(
      "Live monitoring — Proctor Guard AI",
      "Supervise active examination sessions, camera state and risk scores in one board.",
    ),
  component: AdminMonitoring,
});

const FILTERS: { key: RiskLevel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "normal", label: "Normal" },
  { key: "warning", label: "Warning" },
  { key: "suspicious", label: "Suspicious" },
  { key: "high_risk", label: "High risk" },
];

function AdminMonitoring() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const sessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoLiveSessions
      .filter((s) => (filter === "all" ? true : s.risk_level === filter))
      .filter((s) =>
        q
          ? s.student_name.toLowerCase().includes(q) ||
            s.student_code.toLowerCase().includes(q) ||
            s.exam_title.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => b.risk_score - a.risk_score);
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live monitoring"
        description="Active supervised sessions, highest risk first."
        actions={<DemoBadge label="Sample data" />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidate, ID or assessment"
          className="w-full sm:max-w-xs"
          aria-label="Search sessions"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sessions.map((s) => (
          <article key={s.session_id} className="panel space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{s.student_name}</h2>
                <p className="font-mono text-xs text-muted-foreground">{s.student_code}</p>
              </div>
              <RiskBadge level={s.risk_level} />
            </div>

            <p className="text-xs text-muted-foreground">{s.exam_title}</p>

            <RiskMeter score={s.risk_score} />

            <div className="flex flex-wrap gap-1.5">
              <StatusPill
                tone={s.camera === "connected" ? "ok" : "bad"}
                label={s.camera === "connected" ? "Camera live" : "Camera lost"}
              />
              <StatusPill
                tone={s.monitoring === "active" ? "ok" : "warn"}
                label={s.monitoring === "active" ? "Monitoring active" : "Monitoring paused"}
              />
            </div>

            <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Elapsed</dt>
                <dd className="font-mono text-foreground">{formatDuration(s.duration_seconds)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Progress</dt>
                <dd className="font-mono text-foreground">{s.progress}%</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Updated</dt>
                <dd className="text-foreground">{relativeTime(s.last_activity)}</dd>
              </div>
            </dl>

            <p className="truncate text-xs text-muted-foreground">Latest: {s.latest_event}</p>

            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/admin/sessions/$sessionId" params={{ sessionId: s.session_id }}>
                Open session
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
