import { SeverityBadge, DemoBadge } from "@/components/common/badges";
import { EmptyState } from "@/components/common/states";
import { formatClock } from "@/lib/format";
import type { ProctorEvent } from "@/types";
import { cn } from "@/lib/utils";

export function EventTimeline({
  events,
  className,
  limit,
}: {
  events: ProctorEvent[];
  className?: string;
  limit?: number;
}) {
  const ordered = [...events].reverse().slice(0, limit ?? events.length);

  if (ordered.length === 0) {
    return (
      <EmptyState
        title="No proctoring events recorded"
        description="Events appear here as monitoring signals arrive during the session."
      />
    );
  }

  return (
    <ol className={cn("divide-y divide-border", className)}>
      {ordered.map((event) => (
        <li key={event.id} className="flex items-start gap-3 py-2.5">
          <span className="w-[68px] shrink-0 pt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
            {formatClock(event.created_at)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">{event.description}</span>
              <SeverityBadge severity={event.severity} />
              {event.source === "demo_simulation" && <DemoBadge label="Demo / test event" />}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {event.risk_impact > 0 ? `Risk +${event.risk_impact}` : "No risk impact"} · score after{" "}
              <span className="font-mono tabular-nums">{event.risk_score_after}</span>
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}