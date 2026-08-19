import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Camera, Mic, Monitor, Wifi, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/brand/logo";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { useCamera } from "@/hooks/use-camera";
import { demoExams } from "@/lib/demo-data";
import { grantConsent } from "@/services/attempt-store";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/exam/$examId/system-check")({
  ssr: false,
  loader: ({ params }) => {
    const exam = demoExams.find((e) => e.id === params.examId);
    if (!exam) throw notFound();
    return { exam };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Assessment unavailable — Proctor Guard AI" }, { name: "robots", content: "noindex" }] };
    }
    return pageHead(
      `System check — ${loaderData.exam.title}`,
      "Verify your camera, microphone, browser and connection before starting this supervised assessment.",
    );
  },
  component: SystemCheckPage,
  errorComponent: () => <CheckFallback title="This page didn't load" />,
  notFoundComponent: () => <CheckFallback title="Assessment not found" />,
});

function CheckFallback({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel max-w-md p-6 text-center">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The assessment you requested is not available. Return to the assessment list and try again.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

function SystemCheckPage() {
  const { exam } = Route.useLoaderData();
  const navigate = useNavigate();
  const { bindVideo, requestCamera, requestMicrophone, cameraState, micState } = useCamera();
  const [consent, setConsent] = useState(false);
  const [online, setOnline] = useState(true);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    setFullscreenSupported(Boolean(document.documentElement.requestFullscreen));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const ready = cameraState === "granted" && consent;

  function start() {
    grantConsent(exam.id);
    void navigate({ to: "/exam/$examId/attempt", params: { examId: exam.id } });
  }

  const checks = [
    {
      icon: Camera,
      label: "Camera",
      value:
        cameraState === "granted"
          ? "Access granted"
          : cameraState === "denied"
            ? "Access denied"
            : cameraState === "unavailable"
              ? "No camera available"
              : "Not requested",
      tone: cameraState === "granted" ? ("ok" as const) : cameraState === "idle" ? ("neutral" as const) : ("bad" as const),
      required: true,
    },
    {
      icon: Mic,
      label: "Microphone",
      value:
        micState === "granted"
          ? "Access granted"
          : micState === "denied"
            ? "Access denied"
            : micState === "unavailable"
              ? "No microphone available"
              : "Not requested",
      tone: micState === "granted" ? ("ok" as const) : micState === "idle" ? ("neutral" as const) : ("warn" as const),
      required: false,
    },
    {
      icon: Wifi,
      label: "Connection",
      value: online ? "Online" : "Offline",
      tone: online ? ("ok" as const) : ("bad" as const),
      required: true,
    },
    {
      icon: Monitor,
      label: "Browser",
      value: "Supported",
      tone: "ok" as const,
      required: true,
    },
    {
      icon: Maximize,
      label: "Fullscreen",
      value: fullscreenSupported ? "Available" : "Not available",
      tone: fullscreenSupported ? ("ok" as const) : ("warn" as const),
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Proctor Guard AI home">
            <Logo />
          </Link>
          <DemoBadge label="Demo monitoring" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground sm:text-xl">System check</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {exam.title} · {exam.total_questions} questions · {exam.duration_minutes} minutes
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <section className="panel p-4">
            <h2 className="text-sm font-semibold text-foreground">Camera preview</h2>
            <div className="mt-3 aspect-video w-full overflow-hidden rounded border border-border bg-secondary">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={bindVideo}
                muted
                playsInline
                className="h-full w-full object-cover"
                aria-label="Your camera preview"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => void requestCamera()} disabled={cameraState === "requesting"}>
                {cameraState === "granted" ? "Camera connected" : "Enable camera"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void requestMicrophone()}
                disabled={micState === "requesting"}
              >
                {micState === "granted" ? "Microphone connected" : "Enable microphone"}
              </Button>
            </div>
            {cameraState === "denied" && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                Camera access was blocked. Allow camera access in your browser settings, then request it again.
              </p>
            )}
          </section>

          <section className="panel p-4">
            <h2 className="text-sm font-semibold text-foreground">Readiness</h2>
            <ul className="mt-3 divide-y divide-border">
              {checks.map(({ icon: Icon, label, value, tone, required }) => (
                <li key={label} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                    {required && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">required</span>}
                  </span>
                  <StatusPill tone={tone} label={value} />
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground">Monitoring notice</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                During this attempt the platform records camera and microphone availability, face presence and
                attention signals, and browser focus events such as tab switches or leaving fullscreen. These
                signals produce an advisory risk score reviewed by a human examiner. In this demonstration build
                detection responses are simulated and clearly labelled.
              </p>
              <label className="mt-3 flex items-start gap-2.5 text-sm text-foreground">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  aria-describedby="consent-help"
                />
                <span>
                  I understand and consent to monitoring for the duration of this assessment.
                  <span id="consent-help" className="mt-0.5 block text-xs text-muted-foreground">
                    Required before the attempt can begin.
                  </span>
                </span>
              </label>

              <Button className="mt-4 w-full" disabled={!ready} onClick={start}>
                Start assessment
              </Button>
              {!ready && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Enable your camera and accept the monitoring notice to continue.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}