import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionTitle, StatCard } from "@/components/common/states";
import { DemoBadge, RiskBadge } from "@/components/common/badges";
import { RiskMeter } from "@/components/proctoring/risk-meter";
import { EventTimeline } from "@/components/proctoring/event-timeline";
import { SimulationControls } from "@/components/proctoring/simulation-controls";
import { EVENT_LABEL, RISK_WEIGHTS, RISK_LEVEL_BANDS } from "@/constants";
import { applyEvent, countSuspicious, riskLevelFor, severityFor } from "@/services/risk-engine";
import { pageHead } from "@/lib/seo";
import type { ProctorEvent, ProctorEventType } from "@/types";

export const Route = createFileRoute("/admin/testing")({
  head: () =>
    pageHead(
      "Testing mode — Proctor Guard AI",
      "Fire simulated proctoring signals to verify risk weighting and severity rules end to end.",
    ),
  component: AdminTesting,
});

function AdminTesting() {
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [score, setScore] = useState(0);

  function simulate(type: ProctorEventType) {
    const outcome = applyEvent(score, type);
    const next = outcome.score;
    const event: ProctorEvent = {
      id: `sim-${Date.now()}-${type}`,
      session_id: "testing-mode",
      event_type: type,
      severity: severityFor(type),
      description: EVENT_LABEL[type],
      risk_impact: next - score,
      risk_score_after: next,
      source: "demo_simulation",
      created_at: new Date().toISOString(),
    };
    setScore(next);
    setEvents((prev) => [...prev, event]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testing mode"
        description="A sandbox for validating the risk engine without a live candidate."
        actions={
          <>
            <DemoBadge label="Simulation only" />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEvents([]);
                setScore(0);
              }}
            >
              Reset
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Risk score" value={score} tone={score > 60 ? "danger" : "default"} />
        <StatCard label="Signals fired" value={events.length} />
        <StatCard label="Suspicious signals" value={countSuspicious(events)} />
        <StatCard label="Current level" value={events.length ? riskLevelFor(score).replace("_", " ") : "normal"} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="panel p-4">
          <SectionTitle>Live score</SectionTitle>
          <RiskMeter score={score} />
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Level</span>
            <RiskBadge level={riskLevelFor(score)} />
          </div>
          <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs">
            {RISK_LEVEL_BANDS.map((band) => (
              <li key={band.level} className="flex items-center justify-between">
                <span className="text-muted-foreground">{band.label}</span>
                <span className="font-mono text-foreground">
                  {band.min}–{band.max}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="panel p-4">
            <SimulationControls onSimulate={simulate} columns="sm:grid-cols-2 xl:grid-cols-3" />
          </div>
          <div className="panel p-4">
            <SectionTitle aside={<span className="text-xs text-muted-foreground">{events.length} entries</span>}>
              Simulated timeline
            </SectionTitle>
            <EventTimeline events={events} />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Risk weighting reference</SectionTitle>
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">Signal</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Severity</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(RISK_WEIGHTS) as ProctorEventType[]).map((type) => (
                <tr key={type} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{EVENT_LABEL[type]}</td>
                  <td className="px-4 py-2.5 capitalize text-muted-foreground">{severityFor(type)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">
                    {RISK_WEIGHTS[type] > 0 ? `+${RISK_WEIGHTS[type]}` : "±0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
