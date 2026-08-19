import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, StatCard } from "@/components/common/states";
import { DemoBadge, RiskBadge } from "@/components/common/badges";
import { Logo } from "@/components/brand/logo";
import { RiskMeter } from "@/components/proctoring/risk-meter";
import { EventTimeline } from "@/components/proctoring/event-timeline";
import { demoExams, demoOtherQuestions, demoQuestions } from "@/lib/demo-data";
import { formatDateTime, formatDuration } from "@/lib/format";
import { getResult } from "@/services/attempt-store";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { OptionKey, Question } from "@/types";

export const Route = createFileRoute("/exam/$examId/result")({
  ssr: false,
  loader: ({ params }) => {
    const exam = demoExams.find((e) => e.id === params.examId);
    if (!exam) throw notFound();
    return { exam };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Result unavailable — Proctor Guard AI" }, { name: "robots", content: "noindex" }] };
    }
    const base = pageHead(
      `Result — ${loaderData.exam.title}`,
      "Your score, answer review and proctoring summary for this supervised attempt.",
    );
    return { meta: [...base.meta, { name: "robots", content: "noindex" }] };
  },
  component: ResultPage,
});

function optionText(q: Question, key: OptionKey): string {
  return { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[key];
}

function ResultPage() {
  const { exam } = Route.useLoaderData();
  const result = getResult(exam.id);
  const questions =
    exam.id === demoQuestions[0]?.exam_id
      ? demoQuestions
      : demoOtherQuestions.map((q, i) => ({ ...q, exam_id: exam.id, position: i + 1 }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Proctor Guard AI home">
            <Logo />
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link to="/student/dashboard">Candidate portal</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {!result ? (
          <EmptyState
            title="No submitted attempt found in this browser"
            description="Results are stored locally for this demonstration. Start the assessment to generate a report."
            action={
              <Button asChild>
                <Link to="/exam/$examId/system-check" params={{ examId: exam.id }}>
                  Begin system check
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground sm:text-xl">Attempt report</h1>
                <DemoBadge label="Demo proctoring" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {exam.title} · submitted {formatDateTime(result.submitted_at)}
                {result.auto_submitted && " · auto-submitted when time expired"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Score"
                value={`${result.score}%`}
                tone={result.score >= 60 ? "success" : "warning"}
                hint={`${result.correct_count} of ${result.total_questions} correct`}
              />
              <StatCard label="Attempted" value={`${result.attempted_count}/${result.total_questions}`} />
              <StatCard label="Time spent" value={formatDuration(result.time_spent_seconds)} />
              <StatCard
                label="Proctoring events"
                value={result.events.length}
                tone={result.events.length > 4 ? "warning" : "default"}
              />
            </div>

            <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
              <div className="panel p-4">
                <h2 className="text-sm font-semibold text-foreground">Integrity summary</h2>
                <div className="mt-3">
                  <RiskMeter score={result.risk_score} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Final level</span>
                  <RiskBadge level={result.risk_level} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  This score is advisory. An examiner reviews the timeline before any decision is recorded.
                </p>
              </div>
              <div className="panel p-4">
                <h2 className="mb-2 text-sm font-semibold text-foreground">Proctoring timeline</h2>
                <EventTimeline events={result.events} />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                {exam.reveal_answers ? "Answer review" : "Response summary"}
              </h2>
              <ol className="panel divide-y divide-border">
                {questions.map((q) => {
                  const picked = result.answers[q.id] ?? null;
                  const correct = picked === q.correct_option;
                  return (
                    <li key={q.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">
                          <span className="mr-2 font-mono text-xs text-muted-foreground">Q{q.position}</span>
                          {q.prompt}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                            picked === null
                              ? "border-border text-muted-foreground"
                              : correct
                                ? "border-success/40 bg-success/10 text-success"
                                : "border-destructive/40 bg-destructive/10 text-destructive",
                          )}
                        >
                          {picked === null ? "Skipped" : correct ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                        <div className="flex gap-2">
                          <dt className="text-muted-foreground">Your answer</dt>
                          <dd className="text-foreground">
                            {picked ? `${picked} · ${optionText(q, picked)}` : "—"}
                          </dd>
                        </div>
                        {exam.reveal_answers && (
                          <div className="flex gap-2">
                            <dt className="text-muted-foreground">Correct answer</dt>
                            <dd className="text-foreground">
                              {q.correct_option} · {optionText(q, q.correct_option)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/student/history">Exam history</Link>
              </Button>
              <Button asChild>
                <Link to="/student/exams">Other assessments</Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}