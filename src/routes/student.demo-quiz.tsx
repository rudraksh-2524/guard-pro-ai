import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/states";
import { DemoBadge } from "@/components/common/badges";
import { DEMO_EXAM_ID, RISK_WEIGHTS } from "@/constants";
import { demoExams } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/student/demo-quiz")({
  head: () =>
    pageHead(
      "Demo quiz — Proctor Guard AI",
      "Take a fully proctored ten-question demonstration assessment and see the risk timeline it produces.",
    ),
  component: DemoQuizPage,
});

function DemoQuizPage() {
  const exam = demoExams.find((e) => e.id === DEMO_EXAM_ID);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demo quiz"
        description="A complete supervised attempt: system check, monitored questions, risk timeline and result report."
        actions={
          <Button asChild>
            <Link to="/exam/$examId/system-check" params={{ examId: DEMO_EXAM_ID }}>
              Begin system check
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">{exam?.title}</h2>
            <DemoBadge />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{exam?.description}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Questions</dt>
              <dd className="font-mono text-foreground">{exam?.total_questions}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Duration</dt>
              <dd className="font-mono text-foreground">{exam?.duration_minutes} min</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Answers revealed</dt>
              <dd className="font-mono text-foreground">{exam?.reveal_answers ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Proctoring</dt>
              <dd className="font-mono text-foreground">Demo mode</dd>
            </div>
          </dl>
          <ol className="mt-4 space-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
            <li>1. Grant camera and microphone access on the system-check screen.</li>
            <li>2. Acknowledge the monitoring notice to unlock the attempt.</li>
            <li>3. Answer the questions; use the palette to mark items for review.</li>
            <li>4. Submit and review your score alongside the proctoring timeline.</li>
          </ol>
        </div>

        <div className="panel p-4">
          <h2 className="text-sm font-semibold text-foreground">What affects your risk score</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Leaving the exam tab", RISK_WEIGHTS.tab_switched],
              ["Exiting fullscreen", RISK_WEIGHTS.fullscreen_exited],
              ["Looking away repeatedly", RISK_WEIGHTS.looking_away],
              ["Face not visible", RISK_WEIGHTS.face_missing],
              ["Another person in frame", RISK_WEIGHTS.multiple_faces],
              ["Phone or notes detected", RISK_WEIGHTS.object_detected],
            ].map(([label, weight]) => (
              <li key={String(label)} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono text-xs text-foreground">+{weight}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
            Signals are advisory only and are reviewed by an examiner before any action is taken.
          </p>
        </div>
      </div>
    </div>
  );
}