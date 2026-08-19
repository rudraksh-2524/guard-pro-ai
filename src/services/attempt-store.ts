/**
 * Local attempt store.
 *
 * Holds the current attempt (system-check consent, answers, submitted result)
 * so the exam flow survives a reload. A Supabase-backed implementation would
 * replace these functions with `exam_sessions` / `exam_answers` writes without
 * changing the calling components.
 */
import type { OptionKey, ProctorEvent, RiskLevel } from "@/types";

const CONSENT_KEY = "pga.consent.v1";
const RESULT_KEY = "pga.results.v1";

export interface AttemptResult {
  session_id: string;
  exam_id: string;
  submitted_at: string;
  time_spent_seconds: number;
  score: number;
  correct_count: number;
  incorrect_count: number;
  attempted_count: number;
  total_questions: number;
  answers: Record<string, OptionKey | null>;
  risk_score: number;
  risk_level: RiskLevel;
  events: ProctorEvent[];
  auto_submitted: boolean;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the attempt still works in-memory */
  }
}

export function grantConsent(examId: string): void {
  const all = read<Record<string, string>>(CONSENT_KEY, {});
  all[examId] = new Date().toISOString();
  write(CONSENT_KEY, all);
}

export function hasConsent(examId: string): boolean {
  return Boolean(read<Record<string, string>>(CONSENT_KEY, {})[examId]);
}

export function saveResult(result: AttemptResult): void {
  const all = read<Record<string, AttemptResult>>(RESULT_KEY, {});
  all[result.exam_id] = result;
  write(RESULT_KEY, all);
}

export function getResult(examId: string): AttemptResult | null {
  return read<Record<string, AttemptResult>>(RESULT_KEY, {})[examId] ?? null;
}

export function newSessionId(): string {
  return `ses-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}