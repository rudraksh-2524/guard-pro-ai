import { RISK_LEVEL_BANDS } from "@/constants";
import { RiskBadge } from "@/components/common/badges";
import { riskLevelFor } from "@/services/risk-engine";
import { cn } from "@/lib/utils";

export function RiskMeter({
  score,
  className,
  compact = false,
}: {
  score: number;
  className?: string;
  compact?: boolean;
}) {
  const level = riskLevelFor(score);
  const barTone = {
    normal: "bg-success",
    warning: "bg-warning",
    suspicious: "bg-destructive/80",
    high_risk: "bg-destructive",
  }[level];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Risk score
        </span>
        <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
          {score}
          <span className="text-xs text-muted-foreground">/100</span>
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Session risk score"
      >
        <div className={cn("h-full transition-all duration-500", barTone)} style={{ width: `${score}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <RiskBadge level={level} />
        {!compact && (
          <span className="text-[11px] text-muted-foreground">
            {RISK_LEVEL_BANDS.map((b) => `${b.label} ${b.min}–${b.max}`).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}