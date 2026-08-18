import { Camera, Mic, ScanFace, Users, Smartphone, Eye, Radio } from "lucide-react";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { RiskMeter } from "@/components/proctoring/risk-meter";
import type { ProctorStatus } from "@/types";
import { cn } from "@/lib/utils";

function Row({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof Camera;
  label: string;
  tone: "ok" | "warn" | "bad" | "neutral";
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
      <StatusPill tone={tone} label={value} />
    </div>
  );
}

export function MonitoringPanel({
  status,
  eventCount,
  className,
  compact = false,
}: {
  status: ProctorStatus | null;
  eventCount: number;
  className?: string;
  compact?: boolean;
}) {
  if (!status) {
    return (
      <div className={cn("panel p-4 text-sm text-muted-foreground", className)}>
        Connecting to monitoring service…
      </div>
    );
  }

  return (
    <div className={cn("panel p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Monitoring</h3>
        {status.demo_mode && <DemoBadge label="Demo mode" />}
      </div>

      <div className="mt-3">
        <RiskMeter score={status.risk_score} compact />
      </div>

      <div className="mt-3 divide-y divide-border border-t border-border pt-1">
        <Row
          icon={Radio}
          label="Monitoring"
          tone={status.monitoring === "active" ? "ok" : "warn"}
          value={status.monitoring === "active" ? "Active" : "Paused"}
        />
        <Row
          icon={Camera}
          label="Camera"
          tone={status.camera === "connected" ? "ok" : "bad"}
          value={status.camera === "connected" ? "Connected" : "Disconnected"}
        />
        <Row
          icon={Mic}
          label="Microphone"
          tone={status.microphone === "connected" ? "ok" : "warn"}
          value={status.microphone === "connected" ? "Connected" : "Disconnected"}
        />
        <Row
          icon={ScanFace}
          label="Face"
          tone={status.face === "detected" ? "ok" : "bad"}
          value={status.face === "detected" ? "Detected" : "Missing"}
        />
        {!compact && (
          <>
            <Row
              icon={Users}
              label="Multiple faces"
              tone={status.multiple_faces ? "bad" : "ok"}
              value={status.multiple_faces ? "Detected" : "Clear"}
            />
            <Row
              icon={Smartphone}
              label="Object detection"
              tone={status.suspicious_object ? "bad" : "ok"}
              value={status.suspicious_object ? "Suspicious object" : "Clear"}
            />
            <Row
              icon={Eye}
              label="Attention"
              tone={status.attention === "normal" ? "ok" : "warn"}
              value={status.attention === "normal" ? "Normal" : "Looking away"}
            />
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">Suspicious events</span>
        <span className="font-mono tabular-nums text-foreground">{eventCount}</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        Signals are advisory. Flagged activity is reviewed by an examiner before any decision.
      </p>
    </div>
  );
}