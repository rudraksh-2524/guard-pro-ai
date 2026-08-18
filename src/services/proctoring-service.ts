/**
 * Proctoring service abstraction.
 *
 * The UI only depends on this interface. A real Python vision backend
 * (YOLO / OpenCV / MediaPipe) can be dropped in by implementing
 * `ProctoringService` against the HTTP endpoints listed in `PROCTOR_ENDPOINTS`
 * and exporting it as `proctoringService`.
 *
 * Until then the mock implementation below returns DEMO data only — it performs
 * no inference and must never be presented as a real detection.
 */
import { EVENT_LABEL } from "@/constants";
import { applyEvent, riskLevelFor, severityFor } from "@/services/risk-engine";
import type { ProctorEvent, ProctorEventType, ProctorStatus } from "@/types";

export const PROCTOR_ENDPOINTS = {
  start: "POST /api/proctor/start",
  frame: "POST /api/proctor/frame",
  status: "GET /api/proctor/status",
  events: "GET /api/proctor/events",
  risk: "GET /api/proctor/risk",
  stop: "POST /api/proctor/stop",
} as const;

export interface StartProctorInput {
  session_id: string;
  exam_id: string;
  student_id: string;
}

export interface FrameInput {
  session_id: string;
  /** base64 frame or blob reference; ignored by the mock implementation. */
  frame?: string;
  captured_at: string;
}

export interface ProctoringService {
  start(input: StartProctorInput): Promise<ProctorStatus>;
  submitFrame(input: FrameInput): Promise<ProctorStatus>;
  getStatus(sessionId: string): Promise<ProctorStatus>;
  getEvents(sessionId: string): Promise<ProctorEvent[]>;
  getRisk(sessionId: string): Promise<{ risk_score: number; risk_level: ProctorStatus["risk_level"] }>;
  stop(sessionId: string): Promise<ProctorStatus>;
  /** Demo/testing hook: inject a simulated event. Not part of the production contract. */
  simulateEvent(sessionId: string, type: ProctorEventType): Promise<{ status: ProctorStatus; event: ProctorEvent }>;
  setDeviceState(sessionId: string, patch: Partial<Pick<ProctorStatus, "camera" | "microphone" | "monitoring">>): Promise<ProctorStatus>;
}

interface SessionState {
  status: ProctorStatus;
  events: ProctorEvent[];
}

const store = new Map<string, SessionState>();
let eventSeq = 0;

function baseStatus(sessionId: string): ProctorStatus {
  return {
    session_id: sessionId,
    monitoring: "active",
    camera: "connected",
    microphone: "connected",
    face: "detected",
    multiple_faces: false,
    suspicious_object: false,
    attention: "normal",
    risk_score: 0,
    risk_level: "normal",
    event_count: 0,
    demo_mode: true,
    updated_at: new Date().toISOString(),
  };
}

function ensure(sessionId: string): SessionState {
  const existing = store.get(sessionId);
  if (existing) return existing;
  const created: SessionState = { status: baseStatus(sessionId), events: [] };
  store.set(sessionId, created);
  return created;
}

function applyStatusSideEffects(status: ProctorStatus, type: ProctorEventType): void {
  switch (type) {
    case "face_missing":
      status.face = "missing";
      break;
    case "face_detected":
      status.face = "detected";
      status.multiple_faces = false;
      status.attention = "normal";
      break;
    case "multiple_faces":
      status.multiple_faces = true;
      break;
    case "looking_away":
      status.attention = "looking_away";
      break;
    case "object_detected":
      status.suspicious_object = true;
      break;
    case "camera_disconnected":
      status.camera = "disconnected";
      status.face = "missing";
      break;
    case "microphone_disconnected":
      status.microphone = "disconnected";
      break;
    case "monitoring_stopped":
      status.monitoring = "paused";
      break;
    case "monitoring_started":
      status.monitoring = "active";
      break;
    default:
      break;
  }
}

function record(
  sessionId: string,
  type: ProctorEventType,
  source: ProctorEvent["source"],
): { status: ProctorStatus; event: ProctorEvent } {
  const state = ensure(sessionId);
  const { score, level, impact } = applyEvent(state.status.risk_score, type);
  const event: ProctorEvent = {
    id: `evt-${sessionId}-${++eventSeq}`,
    session_id: sessionId,
    event_type: type,
    severity: severityFor(type),
    description: EVENT_LABEL[type],
    risk_impact: impact,
    risk_score_after: score,
    source,
    created_at: new Date().toISOString(),
  };
  state.events = [...state.events, event];
  state.status = {
    ...state.status,
    risk_score: score,
    risk_level: level,
    event_count: state.events.filter((e) => e.severity !== "info").length,
    updated_at: event.created_at,
  };
  applyStatusSideEffects(state.status, type);
  return { status: { ...state.status }, event };
}

/** Mock implementation — DEMO data only, no inference performed. */
export const mockProctoringService: ProctoringService = {
  async start(input) {
    store.delete(input.session_id);
    const state = ensure(input.session_id);
    record(input.session_id, "monitoring_started", "browser_signal");
    record(input.session_id, "face_detected", "demo_simulation");
    return { ...state.status };
  },
  async submitFrame(input) {
    // A real backend runs detection here. The mock returns the current state unchanged.
    const state = ensure(input.session_id);
    return { ...state.status, updated_at: input.captured_at };
  },
  async getStatus(sessionId) {
    return { ...ensure(sessionId).status };
  },
  async getEvents(sessionId) {
    return [...ensure(sessionId).events];
  },
  async getRisk(sessionId) {
    const { risk_score } = ensure(sessionId).status;
    return { risk_score, risk_level: riskLevelFor(risk_score) };
  },
  async stop(sessionId) {
    const { status } = record(sessionId, "monitoring_stopped", "browser_signal");
    return status;
  },
  async simulateEvent(sessionId, type) {
    return record(sessionId, type, "demo_simulation");
  },
  async setDeviceState(sessionId, patch) {
    const state = ensure(sessionId);
    state.status = { ...state.status, ...patch, updated_at: new Date().toISOString() };
    return { ...state.status };
  },
};

export const proctoringService: ProctoringService = mockProctoringService;