import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/common/states";
import { DemoBadge, SeverityBadge } from "@/components/common/badges";
import { demoEvidence } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { Severity } from "@/types";

export const Route = createFileRoute("/admin/evidence")({
  head: () =>
    pageHead(
      "Evidence review — Proctor Guard AI",
      "Captured proctoring evidence for medium and high severity signals, ready for examiner review.",
    ),
  component: AdminEvidence,
});

const FILTERS: { key: Severity | "all"; label: string }[] = [
  { key: "all", label: "All severities" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

function AdminEvidence() {
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoEvidence
      .filter((e) => (severity === "all" ? true : e.severity === severity))
      .filter((e) =>
        q
          ? e.student_name.toLowerCase().includes(q) ||
            e.student_code.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => b.captured_at.localeCompare(a.captured_at));
  }, [severity, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence"
        description="Each record links back to the session and signal that produced it."
        actions={<DemoBadge label="Capture pending backend" />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidate or signal"
          className="w-full sm:max-w-xs"
          aria-label="Search evidence"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={severity === f.key ? "default" : "outline"}
              onClick={() => setSeverity(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No evidence matches these filters"
          description="Adjust the severity filter or clear the search."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="panel overflow-hidden">
              <div className="flex h-32 items-center justify-center border-b border-border bg-secondary/40">
                <div className="text-center">
                  <ImageOff className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-1 text-xs text-muted-foreground">Frame capture not stored in demo mode</p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">{item.student_name}</h2>
                    <p className="font-mono text-xs text-muted-foreground">{item.student_code}</p>
                  </div>
                  <SeverityBadge severity={item.severity} />
                </div>
                <p className="text-sm text-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.exam_title}</p>
                <p className="font-mono text-xs text-muted-foreground">{formatDateTime(item.captured_at)}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to="/admin/sessions/$sessionId" params={{ sessionId: item.session_id }}>
                    Open session
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
