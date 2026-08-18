import { RISK_LEVEL_LABEL, SEVERITY_LABEL } from "@/constants";
import { cn } from "@/lib/utils";
import type { RiskLevel, Severity } from "@/types";

const riskStyles: Record<RiskLevel, string> = {
  normal: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  suspicious: "border-destructive/35 bg-destructive/10 text-destructive",
  high_risk: "border-destructive bg-destructive/20 text-destructive",
};

const severityStyles: Record<Severity, string> = {
  info: "border-border bg-secondary text-muted-foreground",
  low: "border-info/40 bg-info/10 text-info",
  medium: "border-warning/40 bg-warning/10 text-warning",
  high: "border-destructive/45 bg-destructive/12 text-destructive",
};

const base =
  "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return <span className={cn(base, riskStyles[level], className)}>{RISK_LEVEL_LABEL[level]}</span>;
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <span className={cn(base, severityStyles[severity], className)}>{SEVERITY_LABEL[severity]}</span>;
}

export function StatusPill({
  tone,
  label,
  className,
}: {
  tone: "ok" | "warn" | "bad" | "neutral";
  label: string;
  className?: string;
}) {
  const dot = {
    ok: "bg-success",
    warn: "bg-warning",
    bad: "bg-destructive",
    neutral: "bg-muted-foreground",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-foreground", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
      {label}
    </span>
  );
}

export function DemoBadge({ className, label = "Demo data" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-info/40 bg-info/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-info",
        className,
      )}
    >
      {label}
    </span>
  );
}