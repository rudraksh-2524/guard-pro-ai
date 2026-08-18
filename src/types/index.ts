/**
 * Database-ready domain models.
 *
 * These interfaces mirror the intended PostgreSQL/Supabase schema so the mock
 * service layer can be swapped for real tables/endpoints without touching UI code.
 *
 * users(id, email, role, ...) 1—1 students / admins
 * exams(id, created_by -> users.id) 1—N questions
 * exam_sessions(id, exam_id -> exams.id, student_id -> students.id)
 *   1—N exam_answers, 1—N proctor_events, 1—N risk_scores, 1—N evidence
 * reports(id, generated_by -> users.id)
 */

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  student_code: string;
  full_name: string;
  email: string;
  program: string;
  year: number;
  is_active: boolean;
  created_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string;
}

export type ExamStatus = "draft" | "published" | "archived";

export interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  starts_at: string;
  ends_at: string;
  status: ExamStatus;
  reveal_answers: boolean;
  proctoring_enabled: boolean;
  created_by: string;
  created_at: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type OptionKey = "A" | "B" | "C" | "D";

export interface Question {
  id: string;
  exam_id: string;
  position: number;
  prompt: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionKey;
  marks: number;
  difficulty: Difficulty;
}

export type SessionStatus = "scheduled" | "in_progress" | "submitted" | "terminated";

export interface ExamSession {
  id: string;
  exam_id: string;
  student_id: string;
  status: SessionStatus;
  started_at: string | null;
  submitted_at: string | null;
  time_spent_seconds: number;
  score: number;
  correct_count: number;
  incorrect_count: number;
  attempted_count: number;
  final_risk_score: number;
  suspicious_event_count: number;
}

export interface ExamAnswer {
  id: string;
  session_id: string;
  question_id: string;
  selected_option: OptionKey | null;
  marked_for_review: boolean;
  is_correct: boolean | null;
  answered_at: string | null;
}

export type ProctorEventType =
  | "face_detected"
  | "face_missing"
  | "multiple_faces"
  | "looking_away"
  | "object_detected"
  | "camera_disconnected"
  | "microphone_disconnected"
  | "fullscreen_exited"
  | "tab_switched"
  | "monitoring_started"
  | "monitoring_stopped";

export type Severity = "info" | "low" | "medium" | "high";

export interface ProctorEvent {
  id: string;
  session_id: string;
  event_type: ProctorEventType;
  severity: Severity;
  description: string;
  risk_impact: number;
  risk_score_after: number;
  /** Mock/simulated origin. Real detections will report source: "vision_engine". */
  source: "demo_simulation" | "browser_signal" | "vision_engine";
  created_at: string;
}

export interface RiskScoreSample {
  id: string;
  session_id: string;
  score: number;
  level: RiskLevel;
  recorded_at: string;
}

export type RiskLevel = "normal" | "warning" | "suspicious" | "high_risk";

export interface Evidence {
  id: string;
  session_id: string;
  event_id: string;
  student_name: string;
  student_code: string;
  exam_title: string;
  event_type: ProctorEventType;
  severity: Severity;
  description: string;
  /** Storage path once evidence capture is connected. */
  storage_path: string | null;
  captured_at: string;
}

export type ReportType = "exam" | "student" | "proctoring" | "suspicious_activity";

export interface Report {
  id: string;
  report_type: ReportType;
  title: string;
  filters: Record<string, string>;
  status: "queued" | "ready" | "failed";
  generated_by: string;
  generated_at: string;
}

/* ---------- Live proctoring (API-ready contract) ---------- */

export type DeviceState = "connected" | "disconnected";

export interface ProctorStatus {
  session_id: string;
  monitoring: "active" | "paused";
  camera: DeviceState;
  microphone: DeviceState;
  face: "detected" | "missing";
  multiple_faces: boolean;
  suspicious_object: boolean;
  attention: "normal" | "looking_away";
  risk_score: number;
  risk_level: RiskLevel;
  event_count: number;
  /** true while mock data is used instead of the Python vision backend. */
  demo_mode: boolean;
  updated_at: string;
}

export interface LiveSession {
  session_id: string;
  student_name: string;
  student_code: string;
  exam_title: string;
  camera: DeviceState;
  monitoring: "active" | "paused";
  risk_score: number;
  risk_level: RiskLevel;
  latest_event: string;
  last_activity: string;
  duration_seconds: number;
  progress: number;
}