import { cn } from "@/lib/utils";

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Proctor Guard AI"
      className={cn("h-7 w-7", className)}
      fill="none"
    >
      <path
        d="M16 2.5 5.5 6.4v9.1c0 6.4 4.2 12.2 10.5 14 6.3-1.8 10.5-7.6 10.5-14V6.4L16 2.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m11.2 16.2 3.4 3.4 6.4-6.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  showTagline = false,
  compact = false,
}: {
  className?: string;
  showTagline?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-border bg-secondary text-primary">
        <ShieldMark className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-semibold tracking-tight text-foreground">
            Proctor Guard <span className="text-primary">AI</span>
          </span>
          {showTagline && (
            <span className="block text-[11px] text-muted-foreground">Intelligent Examination Security</span>
          )}
        </span>
      )}
    </div>
  );
}