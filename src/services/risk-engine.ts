import { EVENT_SEVERITY, RISK_LEVEL_BANDS, RISK_WEIGHTS } from "@/constants";
import type { ProctorEvent, ProctorEventType, RiskLevel, Severity } from "@/types";

export interface RiskEngineConfig {
  weights: Record<ProctorEventType, number>;
  max: number;
  /** Passive decay per minute of clean behaviour. */
  decayPerMinute: number;
}

export const defaultRiskConfig: RiskEngineConfig = {
  weights: RISK_WEIGHTS,
  max: 100,
  decayPerMinute: 0,
};

export function clampScore(score: number, max = 100): number {
  return Math.max(0, Math.min(max, Math.round(score)));
}

export function riskLevelFor(score: number): RiskLevel {
  const band = RISK_LEVEL_BANDS.find((b) => score >= b.min && score <= b.max);
  return band ? band.level : "normal";
}

export function riskImpactFor(
  type: ProctorEventType,
  config: RiskEngineConfig = defaultRiskConfig,
): number {
  return config.weights[type] ?? 0;
}

export function severityFor(type: ProctorEventType): Severity {
  return EVENT_SEVERITY[type];
}

export function applyEvent(
  currentScore: number,
  type: ProctorEventType,
  config: RiskEngineConfig = defaultRiskConfig,
): { score: number; level: RiskLevel; impact: number } {
  const impact = riskImpactFor(type, config);
  const score = clampScore(currentScore + impact, config.max);
  return { score, level: riskLevelFor(score), impact };
}

export function scoreFromEvents(
  events: Pick<ProctorEvent, "event_type">[],
  config: RiskEngineConfig = defaultRiskConfig,
): number {
  return events.reduce((acc, e) => clampScore(acc + riskImpactFor(e.event_type, config), config.max), 0);
}

export function countSuspicious(events: Pick<ProctorEvent, "severity">[]): number {
  return events.filter((e) => e.severity === "medium" || e.severity === "high").length;
}