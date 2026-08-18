import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo, ShieldMark } from "@/components/brand/logo";
import { DemoBadge } from "@/components/common/badges";
import { DEMO_EXAM_ID, RISK_LEVEL_BANDS, RISK_WEIGHTS } from "@/constants";
import { demoExams } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";
import { PROCTOR_ENDPOINTS } from "@/services/proctoring-service";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Proctor Guard AI — Intelligent Examination Security",
      "Conduct secure online assessments with real-time monitoring, suspicious-activity analysis, risk scoring and detailed examination reports.",
    ),
  component: LandingPage,
});

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#proctoring", label: "Proctoring" },
  { href: "#experience", label: "Exam experience" },
  { href: "#analytics", label: "Risk analytics" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-2 max-w-2xl text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
        {intro && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

function LandingPage() {
  const demoExam = demoExams.find((e) => e.id === DEMO_EXAM_ID);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Proctor Guard AI home">
            <Logo showTagline />
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Admin Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/exam/$examId/system-check" params={{ examId: DEMO_EXAM_ID }}>
                Try Demo Exam
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="grid-lines border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded border border-border bg-card px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              <ShieldMark className="h-3.5 w-3.5 text-primary" /> Examination integrity platform
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Intelligent Examination Security
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Conduct secure online assessments with real-time monitoring, suspicious-activity analysis, risk
              scoring, and detailed examination reports.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/exam/$examId/system-check" params={{ examId: DEMO_EXAM_ID }}>
                  Try Demo Exam
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Admin Login</Link>
              </Button>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-relaxed text-muted-foreground">
              Proctoring signals are advisory. The platform highlights activity for human review — it does not
              declare misconduct on its own.
            </p>
          </div>

          <div className="panel p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Session monitor
              </span>
              <DemoBadge label="Demo preview" />
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Candidate", "Aarav Sharma · CS21-0148"],
                ["Exam", "Data Structures — Mid Semester"],
                ["Camera", "Connected"],
                ["Face", "Detected"],
                ["Attention", "Looking away"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="truncate text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border-t border-border pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Risk score</span>
                <span className="font-mono text-2xl font-semibold text-warning">42</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[42%] bg-warning" />
              </div>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-muted-foreground">
                <li>10:38:04 · Face detected · +0</li>
                <li>10:41:52 · Looking away · +10</li>
                <li>10:42:18 · Tab switched · +20</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Four stages, from device check to examiner review"
        intro="Every session follows the same auditable path so results and integrity findings can be defended."
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "System check",
              body: "Camera, microphone, browser, connection and fullscreen availability are verified, with explicit consent captured.",
            },
            {
              step: "02",
              title: "Supervised attempt",
              body: "The candidate answers in a focused interface while device and attention signals are recorded.",
            },
            {
              step: "03",
              title: "Risk scoring",
              body: "Each signal carries a configurable weight; the session score and level update immediately.",
            },
            {
              step: "04",
              title: "Examiner review",
              body: "Investigators open the timeline, evidence and score history before recording any decision.",
            },
          ].map((s) => (
            <li key={s.step} className="panel p-4">
              <span className="font-mono text-xs text-primary">{s.step}</span>
              <h3 className="mt-2 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="proctoring"
        eyebrow="AI-assisted proctoring"
        title="Detection runs server-side, the interface stays auditable"
        intro="The browser never performs inference. Frames are handed to a dedicated vision service through a typed contract, so detection models can evolve without changing the examination interface."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-4">
            <h3 className="text-sm font-semibold text-foreground">Signals surfaced to examiners</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Camera connected / disconnected",
                "Face detected / missing",
                "Multiple faces clear / detected",
                "Object detection clear / suspicious",
                "Attention normal / looking away",
                "Microphone connected / disconnected",
                "Fullscreen exited",
                "Tab switched",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Service contract</h3>
              <DemoBadge label="Mock responses today" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A Python vision service (YOLO / OpenCV / MediaPipe) will implement these endpoints. Until it is
              connected, the platform returns clearly-labelled demo data.
            </p>
            <ul className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
              {Object.values(PROCTOR_ENDPOINTS).map((endpoint) => (
                <li key={endpoint} className="rounded border border-border bg-secondary/40 px-2 py-1">
                  {endpoint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        eyebrow="Examination experience"
        title="A calm interface that keeps candidates informed"
        intro="Candidates always see what is monitored, how much time remains and which questions still need attention — on desktop and on a phone."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Question palette", "Answered, marked-for-review and unseen questions at a glance."],
            ["Persistent timer", "Countdown with auto-submit and a clear confirmation step."],
            ["Visible monitoring", "Camera preview and device status remain accessible, including on mobile."],
            ["Mark for review", "Candidates flag questions and return to them without losing answers."],
            ["Connection state", "Network and camera interruptions are shown as they happen."],
            ["Accessible controls", "Keyboard navigation, labelled options and visible focus states."],
          ].map(([title, body]) => (
            <div key={title} className="panel p-4">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="analytics"
        eyebrow="Risk analytics"
        title="Weighted scoring, capped and explainable"
        intro="Every event contributes a documented amount to the session score. Nothing is inferred from a hidden model, and no single event is treated as proof."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <caption className="border-b border-border px-4 py-3 text-left text-sm font-semibold text-foreground">
                Default event weights
              </caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-2 font-medium">Event</th>
                  <th scope="col" className="px-4 py-2 text-right font-medium">Risk impact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Phone / object detected", RISK_WEIGHTS.object_detected],
                  ["Multiple faces", RISK_WEIGHTS.multiple_faces],
                  ["Face missing", RISK_WEIGHTS.face_missing],
                  ["Camera disconnected", RISK_WEIGHTS.camera_disconnected],
                  ["Tab switched", RISK_WEIGHTS.tab_switched],
                  ["Fullscreen exited", RISK_WEIGHTS.fullscreen_exited],
                  ["Looking away", RISK_WEIGHTS.looking_away],
                ].map(([label, weight]) => (
                  <tr key={String(label)} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">{label}</td>
                    <td className="px-4 py-2 text-right font-mono text-foreground">+{weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel p-4">
            <h3 className="text-sm font-semibold text-foreground">Risk levels</h3>
            <ul className="mt-3 space-y-2">
              {RISK_LEVEL_BANDS.map((band) => (
                <li key={band.level} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{band.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {band.min}–{band.max}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
              Scores are capped at 100, stored with every event, and reported alongside performance so an
              examiner can weigh both.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="security"
        eyebrow="Security & privacy"
        title="Least privilege, explicit consent, reviewable trail"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Role-based access", "Students and administrators have separate route trees and permissions."],
            ["Protected sessions", "Session state is validated on every navigation into restricted areas."],
            ["No keys in the browser", "Detection and reporting credentials stay on the server."],
            ["Consent first", "Monitoring scope is stated and acknowledged before an attempt begins."],
          ].map(([title, body]) => (
            <div key={title} className="panel p-4">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="features" eyebrow="Platform" title="Everything an examination office needs in one place">
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Exam and question management",
            "Student records and account state",
            "Live monitoring board",
            "Session investigation view",
            "Evidence register",
            "Proctoring and performance reports",
            "Configurable risk weights",
            "Testing mode for validation",
            "Responsive candidate interface",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 border-b border-border py-2 text-sm text-muted-foreground">
              <ShieldMark className="h-3.5 w-3.5 shrink-0 text-primary" />
              {f}
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="demo"
        eyebrow="Demo quiz"
        title="Run a full proctored attempt in under fifteen minutes"
        intro="The demo assessment exercises the entire pipeline: system check, supervised attempt, event timeline, risk scoring and the result report."
      >
        <div className="panel p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {demoExam ? demoExam.title : "AI Fundamentals — Proctored Assessment"}
                </h3>
                <DemoBadge />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                10 multiple-choice questions · 15 minutes · mixed difficulty · monitoring in demo mode
              </p>
            </div>
            <Button asChild>
              <Link to="/exam/$examId/system-check" params={{ examId: DEMO_EXAM_ID }}>
                Start system check
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Common questions">
        <Accordion type="single" collapsible className="max-w-3xl">
          {[
            [
              "Does the platform decide whether a candidate cheated?",
              "No. It records signals, applies documented weights and presents the evidence. Any decision is made by an examiner reviewing the session.",
            ],
            [
              "Is the AI detection engine active?",
              "Not yet. Detection responses are mock data marked as demo until the Python vision service (YOLO, OpenCV, MediaPipe) is connected behind the existing endpoints.",
            ],
            [
              "What is recorded during an attempt?",
              "Device availability, face and attention signals, browser focus events and the resulting risk timeline. The consent notice on the system-check screen states this before the attempt starts.",
            ],
            [
              "Can a candidate take an exam on a phone?",
              "Yes. The candidate interface is built for small screens: the timer, camera preview and monitoring status remain accessible and options are touch-friendly.",
            ],
            [
              "Can risk weights be changed per institution?",
              "Yes. Weights, thresholds and the score cap are configuration values used by a single scoring service, so a policy change does not require interface changes.",
            ],
          ].map(([q, a], i) => (
            <AccordionItem key={q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm">{q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <footer className="py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo showTagline />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Demonstration deployment. All students, exams and proctoring events shown in this build are
              synthetic sample data.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Candidates
              </p>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/exam/$examId/system-check" params={{ examId: DEMO_EXAM_ID }} className="text-muted-foreground hover:text-foreground">
                    Demo exam
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-foreground">
                    Student login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-foreground">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Institution
              </p>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-foreground">
                    Admin login
                  </Link>
                </li>
                <li>
                  <a href="#security" className="text-muted-foreground hover:text-foreground">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-6xl border-t border-border px-4 pt-5 text-xs text-muted-foreground sm:px-6">
          Proctor Guard AI · Intelligent Examination Security
        </div>
      </footer>
    </div>
  );
}