import { ScanFace, Users, Eye, Smartphone, CameraOff, AppWindow, Minimize2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/common/badges";
import type { ProctorEventType } from "@/types";
import { RISK_WEIGHTS } from "@/constants";

export const SIMULATIONS: { type: ProctorEventType; label: string; icon: typeof Eye }[] = [
  { type: "face_detected", label: "Normal behaviour", icon: CheckCircle2 },
  { type: "face_missing", label: "Face missing", icon: ScanFace },
  { type: "multiple_faces", label: "Multiple faces", icon: Users },
  { type: "looking_away", label: "Looking away", icon: Eye },
  { type: "object_detected", label: "Phone detected", icon: Smartphone },
  { type: "camera_disconnected", label: "Camera disconnected", icon: CameraOff },
  { type: "tab_switched", label: "Tab switched", icon: AppWindow },
  { type: "fullscreen_exited", label: "Fullscreen exited", icon: Minimize2 },
];

export function SimulationControls({
  onSimulate,
  disabled = false,
  columns = "sm:grid-cols-2 lg:grid-cols-4",
}: {
  onSimulate: (type: ProctorEventType) => void;
  disabled?: boolean;
  columns?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">Simulate proctoring signal</h3>
        <DemoBadge label="Demo / test only" />
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Simulated signals are recorded with a demo source flag and are never presented as real detections.
      </p>
      <div className={`grid grid-cols-1 gap-2 ${columns}`}>
        {SIMULATIONS.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSimulate(type)}
            className="justify-between"
          >
            <span className="flex items-center gap-2 truncate">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {RISK_WEIGHTS[type] > 0 ? `+${RISK_WEIGHTS[type]}` : "±0"}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}