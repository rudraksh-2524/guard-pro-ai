import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/common/states";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { demoSessions, demoStudents } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/students")({
  head: () =>
    pageHead(
      "Candidate records — Proctor Guard AI",
      "Search and manage enrolled candidates, programmes and account status.",
    ),
  component: AdminStudents,
});

function AdminStudents() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoStudents.filter((s) =>
      q
        ? s.full_name.toLowerCase().includes(q) ||
          s.student_code.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.program.toLowerCase().includes(q)
        : true,
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        description={`${demoStudents.length} enrolled records across all programmes.`}
        actions={
          <>
            <DemoBadge label="Sample records" />
            <Button size="sm" onClick={() => toast.message("Candidate import opens once Cloud is connected")}>
              Import candidates
            </Button>
          </>
        }
      />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, student ID, email or programme"
        className="w-full sm:max-w-md"
        aria-label="Search candidates"
      />

      {rows.length === 0 ? (
        <EmptyState title="No candidates match that search" description="Try a different name or student ID." />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Candidate</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Programme</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Year</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Attempts</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const attempts = demoSessions.filter((x) => x.student_id === s.id).length;
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <span className="block text-foreground">{s.full_name}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {s.student_code} · {s.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.program}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{s.year}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{attempts}</td>
                    <td className="px-4 py-3">
                      <StatusPill tone={s.is_active ? "ok" : "bad"} label={s.is_active ? "Active" : "Suspended"} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(s.created_at)}</td>
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
