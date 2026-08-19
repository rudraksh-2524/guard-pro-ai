import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/common/states";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { DEMO_EXAM_ID } from "@/constants";
import { demoExams } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/student/exams")({
  head: () =>
    pageHead(
      "Available assessments — Proctor Guard AI",
      "Browse the assessments open to you, review the rules and start a supervised attempt.",
    ),
  component: StudentExams,
});

function StudentExams() {
  const [query, setQuery] = useState("");
  const exams = demoExams
    .filter((e) => e.status === "published")
    .filter((e) =>
      `${e.title} ${e.subject}`.toLowerCase().includes(query.trim().toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available assessments"
        description="Each attempt is supervised. Review the duration and question count before you begin."
      />

      <div className="max-w-sm">
        <label htmlFor="exam-search" className="sr-only">
          Search assessments
        </label>
        <Input
          id="exam-search"
          placeholder="Search by title or subject"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {exams.length === 0 ? (
        <EmptyState title="No assessments match your search" description="Try a different title or subject." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {exams.map((exam) => (
            <article key={exam.id} className="panel flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground">{exam.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{exam.subject}</p>
                </div>
                {exam.id === DEMO_EXAM_ID ? <DemoBadge /> : <StatusPill tone="ok" label="Published" />}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{exam.description}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-mono text-foreground">{exam.duration_minutes} min</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Questions</dt>
                  <dd className="font-mono text-foreground">{exam.total_questions}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Opens</dt>
                  <dd className="font-mono text-foreground">{formatDate(exam.starts_at)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Proctoring</dt>
                  <dd className="font-mono text-foreground">{exam.proctoring_enabled ? "On" : "Off"}</dd>
                </div>
              </dl>
              <Button asChild size="sm" className="mt-3 self-start">
                <Link to="/exam/$examId/system-check" params={{ examId: exam.id }}>
                  Begin system check
                </Link>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}