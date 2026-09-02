import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionTitle } from "@/components/common/states";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { ParticipationChart, AverageRiskChart } from "@/components/admin/charts";
import { demoReports, dashboardMetrics } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { Report } from "@/types";

export const Route = createFileRoute("/admin/reports")({
  head: () =>
    pageHead(
      "Reports and analytics — Proctor Guard AI",
      "Generate exam, candidate and proctoring reports, and review institution-level participation trends.",
    ),
  component: AdminReports,
});

const statusTone: Record<Report["status"], "ok" | "warn" | "bad"> = {
  ready: "ok",
  queued: "warn",
  failed: "bad",
};

const REPORT_TYPES = [
  { type: "exam", label: "Exam performance", detail: "Scores, attempt counts and question-level accuracy." },
  { type: "student", label: "Candidate history", detail: "Every attempt for one candidate with risk trend." },
  { type: "proctoring", label: "Proctoring summary", detail: "Signals, severities and evidence per session." },
  {
    type: "suspicious_activity",
    label: "Suspicious activity",
    detail: "Only sessions above the suspicious threshold.",
  },
] as const;

function AdminReports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports and analytics"
        description={`Aggregated across ${dashboardMetrics.total_students} candidate records.`}
        actions={<DemoBadge label="Sample analytics" />}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <SectionTitle>Participation by assessment</SectionTitle>
          <ParticipationChart />
        </div>
        <div className="panel p-4">
          <SectionTitle>Average risk — last 14 days</SectionTitle>
          <AverageRiskChart />
        </div>
      </section>

      <section>
        <SectionTitle>Generate a report</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {REPORT_TYPES.map((r) => (
            <article key={r.type} className="panel flex flex-col gap-2 p-4">
              <h3 className="text-sm font-semibold text-foreground">{r.label}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
              <div className="mt-auto flex gap-2 pt-2">
                <Button size="sm" onClick={() => toast.success(`${r.label} report queued`)}>
                  Generate
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.message("CSV export queued")}>
                  Export CSV
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Recent reports</SectionTitle>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Report</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Filters</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Generated</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {demoReports.map((report) => (
                <tr key={report.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{report.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {Object.entries(report.filters)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={statusTone[report.status]} label={report.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {formatDateTime(report.generated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={report.status !== "ready"}
                      onClick={() => toast.message("Download available once Cloud storage is connected")}
                    >
                      Download
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
