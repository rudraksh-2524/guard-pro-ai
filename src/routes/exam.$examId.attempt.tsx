import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Clock, Flag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Logo } from "@/components/brand/logo";
import { DemoBadge } from "@/components/common/badges";
import { MonitoringPanel } from "@/components/proctoring/monitoring-panel";
import { EventTimeline } from "@/components/proctoring/event-timeline";
import { demoExams, demoOtherQuestions, demoQuestions } from "@/lib/demo-data";
import { formatDuration } from "@/lib/format";
import { useCamera } from "@/hooks/use-camera";
import { useCountdown } from "@/hooks/use-countdown";
import { useProctoring } from "@/hooks/use-proctoring";
import { hasConsent, newSessionId, saveResult } from "@/services/attempt-store";
import { riskLevelFor } from "@/services/risk-engine";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { OptionKey, Question } from "@/types";

export const Route = createFileRoute("/exam/$examId/attempt")({
  ssr: false,
  loader: ({ params }) => {
    const exam = demoExams.find((e) => e.id === params.examId);
    if (!exam) throw notFound();
    const questions =
      exam.id === demoQuestions[0]?.exam_id
        ? demoQuestions
        : demoOtherQuestions.map((q, i) => ({ ...q, exam_id: exam.id, position: i + 1 }));
    return { exam, questions };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Attempt unavailable — Proctor Guard AI" }, { name: "robots", content: "noindex" }] };
    }
    const base = pageHead(
      `Attempt — ${loaderData.exam.title}`,
      "Supervised assessment attempt with live monitoring status and a question palette.",
    );
    return { meta: [...base.meta, { name: "robots", content: "noindex" }] };
  },
  component: AttemptPage,
});

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

function optionText(q: Question, key: OptionKey): string {
  return { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[key];
}

function AttemptPage() {
  const { exam, questions } = Route.useLoaderData();
  const navigate = useNavigate();
  const sessionIdRef = useRef(newSessionId());
  const sessionId = sessionIdRef.current;
  const { bindVideo, requestCamera, stopAll, cameraState } = useCamera();

  const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  const { status, events, simulate } = useProctoring({
    sessionId,
    examId: exam.id,
    studentId: "stu-1",
  });

  const totalSeconds = exam.duration_minutes * 60;

  const submit = useCallback(
    (auto: boolean, elapsed: number) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      let correct = 0;
      let attempted = 0;
      for (const q of questions) {
        const picked = answers[q.id] ?? null;
        if (picked) attempted += 1;
        if (picked === q.correct_option) correct += 1;
      }
      const score = Math.round((correct / questions.length) * 100);
      const risk = status?.risk_score ?? 0;
      saveResult({
        session_id: sessionId,
        exam_id: exam.id,
        submitted_at: new Date().toISOString(),
        time_spent_seconds: elapsed,
        score,
        correct_count: correct,
        incorrect_count: attempted - correct,
        attempted_count: attempted,
        total_questions: questions.length,
        answers,
        risk_score: risk,
        risk_level: riskLevelFor(risk),
        events,
        auto_submitted: auto,
      });
      stopAll();
      void navigate({ to: "/exam/$examId/result", params: { examId: exam.id }, replace: true });
    },
    [answers, events, exam.id, navigate, questions, sessionId, status, stopAll],
  );

  const countdown = useCountdown(totalSeconds, () => {
    toast.warning("Time is up — your attempt was submitted automatically.");
    submit(true, totalSeconds);
  });
  const elapsed = countdown.elapsed;

  useEffect(() => {
    if (!hasConsent(exam.id)) {
      void navigate({ to: "/exam/$examId/system-check", params: { examId: exam.id }, replace: true });
      return;
    }
    void requestCamera();
  }, [exam.id, navigate, requestCamera]);

  // Browser integrity signals
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden" && !submittedRef.current) {
        void simulate("tab_switched");
        toast.warning("Leaving the exam tab has been recorded.");
      }
    }
    function onFullscreen() {
      if (!document.fullscreenElement && !submittedRef.current) {
        void simulate("fullscreen_exited");
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [simulate]);

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id]).length,
    [answers, questions],
  );
  const question = questions[current];
  const lowTime = countdown.remaining <= 60;

  if (!question) return null;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo compact />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{exam.title}</span>
              <span className="block text-[11px] text-muted-foreground">
                Question {current + 1} of {questions.length} · {answeredCount} answered
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className={cn(
                "flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-sm tabular-nums",
                lowTime ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-border text-foreground",
              )}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDuration(countdown.remaining)}
            </span>
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
              Submit
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <article className="panel p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Question {question.position} · {question.difficulty} · {question.marks} marks
              </p>
              <Button
                variant={marked[question.id] ? "default" : "outline"}
                size="sm"
                onClick={() => setMarked((m) => ({ ...m, [question.id]: !m[question.id] }))}
              >
                <Flag className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {marked[question.id] ? "Marked" : "Mark for review"}
              </Button>
            </div>
            <h1 className="mt-3 text-base font-medium leading-relaxed text-foreground">{question.prompt}</h1>

            <fieldset className="mt-4 space-y-2">
              <legend className="sr-only">Answer options</legend>
              {OPTION_KEYS.map((key) => {
                const selected = answers[question.id] === key;
                return (
                  <label
                    key={key}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={key}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [question.id]: key }))}
                      className="mt-1 h-3.5 w-3.5 accent-[var(--primary)]"
                    />
                    <span>
                      <span className="mr-2 font-mono text-xs text-primary">{key}</span>
                      {optionText(question, key)}
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 0}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnswers((a) => ({ ...a, [question.id]: null }))}
              >
                Clear answer
              </Button>
              {current === questions.length - 1 ? (
                <Button size="sm" onClick={() => setConfirmOpen(true)}>
                  Review & submit
                </Button>
              ) : (
                <Button size="sm" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                  Next
                </Button>
              )}
            </div>
          </article>

          <section className="panel p-4">
            <h2 className="text-sm font-semibold text-foreground">Question palette</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {questions.map((q, i) => {
                const state = answers[q.id] ? "answered" : marked[q.id] ? "marked" : "unseen";
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-current={i === current ? "true" : undefined}
                    aria-label={`Question ${i + 1}, ${state}`}
                    className={cn(
                      "h-9 w-9 rounded border font-mono text-xs transition-colors",
                      i === current && "ring-2 ring-ring",
                      state === "answered"
                        ? "border-success/50 bg-success/15 text-success"
                        : state === "marked"
                          ? "border-warning/50 bg-warning/15 text-warning"
                          : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Green: answered · Amber: marked for review · Outline: not answered
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="panel p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Your camera</h2>
              <DemoBadge label="Demo mode" />
            </div>
            <div className="mt-2 aspect-video overflow-hidden rounded border border-border bg-secondary">
              <video ref={bindVideo} muted playsInline className="h-full w-full object-cover" aria-label="Your camera preview" />
            </div>
            {cameraState === "denied" && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                Camera access is blocked. This has been recorded in your session.
              </p>
            )}
          </div>

          <MonitoringPanel status={status} eventCount={events.length} />

          <div className="panel p-3">
            <h2 className="mb-1 text-sm font-semibold text-foreground">Recent signals</h2>
            <EventTimeline events={events} limit={6} />
          </div>
        </aside>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this attempt?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {questions.length} questions with{" "}
              {formatDuration(countdown.remaining)} remaining. Submitted attempts cannot be reopened.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep working</AlertDialogCancel>
            <AlertDialogAction onClick={() => submit(false, elapsed)}>Submit attempt</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="mx-auto max-w-7xl px-4 pb-6 text-center text-xs text-muted-foreground sm:px-6">
        Monitoring signals are advisory and reviewed by an examiner.{" "}
        <Link to="/" className="text-primary hover:underline">
          About Proctor Guard AI
        </Link>
      </p>
    </div>
  );
}