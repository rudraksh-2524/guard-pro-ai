import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PageHeader, SectionTitle } from "@/components/common/states";
import { DemoBadge } from "@/components/common/badges";
import { EVENT_LABEL, RISK_LEVEL_BANDS, RISK_WEIGHTS } from "@/constants";
import { PROCTOR_ENDPOINTS } from "@/services/proctoring-service";
import { pageHead } from "@/lib/seo";
import type { ProctorEventType } from "@/types";

export const Route = createFileRoute("/admin/settings")({
  head: () =>
    pageHead(
      "Platform settings — Proctor Guard AI",
      "Configure proctoring sensitivity, risk thresholds, evidence retention and the vision backend endpoints.",
    ),
  component: AdminSettings,
});

function AdminSettings() {
  const [sensitivity, setSensitivity] = useState([65]);
  const [threshold, setThreshold] = useState([80]);
  const [retention, setRetention] = useState("90");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Institution-wide proctoring policy and integration configuration."
        actions={<DemoBadge label="Stored locally in demo" />}
      />

      <form
        className="grid gap-4 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Settings saved");
        }}
      >
        <div className="panel space-y-5 p-4">
          <SectionTitle>Detection policy</SectionTitle>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sensitivity">Detection sensitivity</Label>
              <span className="font-mono text-sm text-foreground">{sensitivity[0]}%</span>
            </div>
            <Slider
              id="sensitivity"
              value={sensitivity}
              onValueChange={setSensitivity}
              min={20}
              max={95}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Higher sensitivity raises signal volume and false positives; examiner review is always required.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="threshold">Auto-flag threshold</Label>
              <span className="font-mono text-sm text-foreground">{threshold[0]}</span>
            </div>
            <Slider id="threshold" value={threshold} onValueChange={setThreshold} min={40} max={100} step={5} />
            <p className="text-xs text-muted-foreground">
              Sessions reaching this score are queued for mandatory review.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="retention">Evidence retention (days)</Label>
            <Input
              id="retention"
              type="number"
              min={7}
              max={365}
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
            />
          </div>

          {[
            { id: "auto-terminate", label: "Auto-terminate at 100", hint: "Ends the attempt and notifies the examiner." },
            { id: "require-fullscreen", label: "Require fullscreen", hint: "Exiting fullscreen records a signal." },
            { id: "block-copy", label: "Block copy and paste", hint: "Disables clipboard shortcuts during attempts." },
            { id: "capture-evidence", label: "Capture evidence frames", hint: "Stores frames for medium and high signals." },
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 rounded border border-border p-3">
              <div>
                <Label htmlFor={row.id}>{row.label}</Label>
                <p className="text-xs text-muted-foreground">{row.hint}</p>
              </div>
              <Switch id={row.id} defaultChecked={row.id !== "auto-terminate"} />
            </div>
          ))}

          <Button type="submit">Save settings</Button>
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <SectionTitle>Risk bands</SectionTitle>
            <ul className="space-y-2 text-sm">
              {RISK_LEVEL_BANDS.map((band) => (
                <li key={band.level} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="text-muted-foreground">{band.label}</span>
                  <span className="font-mono text-foreground">
                    {band.min}–{band.max}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-4">
            <SectionTitle>Signal weights</SectionTitle>
            <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
              {(Object.keys(RISK_WEIGHTS) as ProctorEventType[]).map((type) => (
                <li key={type} className="flex items-center justify-between gap-2">
                  <span className="truncate text-muted-foreground">{EVENT_LABEL[type]}</span>
                  <span className="font-mono text-foreground">
                    {RISK_WEIGHTS[type] > 0 ? `+${RISK_WEIGHTS[type]}` : "±0"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-4">
            <SectionTitle>Vision backend endpoints</SectionTitle>
            <p className="mb-3 text-xs text-muted-foreground">
              The proctoring service is abstracted behind these routes, so a Python vision backend can be attached
              without touching the interface.
            </p>
            <ul className="space-y-1.5 font-mono text-xs">
              {Object.entries(PROCTOR_ENDPOINTS).map(([key, value]) => (
                <li key={key} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-1.5 last:border-0">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground">{String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
