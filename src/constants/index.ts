import type { ProctorEventType, RiskLevel, Severity } from "@/types";

export const APP_NAME = "Proctor Guard AI";
export const APP_TAGLINE = "Intelligent Examination Security";

/** Risk weights applied by the scoring engine. Configurable per deployment. */
export const RISK_WEIGHTS: Record<ProctorEventType, number> = {
  object_detected: 40,
  multiple_faces: 50,
  face_missing: 30,
  looking_away: 10,
  camera_disconnected: 30,
  tab_switched: 20,
  fullscreen_exited: 15,
  microphone_disconnected: 10,
  face_detected: 0,
  monitoring_started: 0,
  monitoring_stopped: 0,
};

export const RISK_LEVEL_BANDS: { level: RiskLevel; min: number; max: number; label: string }[] = [
  { level: "normal", min: 0, max: 30, label: "Normal" },
  { level: "warning", min: 31, max: 60, label: "Warning" },
  { level: "suspicious", min: 61, max: 80, label: "Suspicious" },
  { level: "high_risk", min: 81, max: 100, label: "High risk" },
];

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  normal: "Normal",
  warning: "Warning",
  suspicious: "Suspicious",
  high_risk: "High risk",
};

export const EVENT_LABEL: Record<ProctorEventType, string> = {
  face_detected: "Face detected",
  face_missing: "Face missing",
  multiple_faces: "Multiple faces detected",
  looking_away: "Attention event — looking away",
  object_detected: "Phone / object detected",
  camera_disconnected: "Camera disconnected",
  microphone_disconnected: "Microphone disconnected",
  fullscreen_exited: "Fullscreen exited",
  tab_switched: "Tab switched",
  monitoring_started: "Monitoring started",
  monitoring_stopped: "Monitoring stopped",
};

export const EVENT_SEVERITY: Record<ProctorEventType, Severity> = {
  object_detected: "high",
  multiple_faces: "high",
  face_missing: "medium",
  camera_disconnected: "medium",
  tab_switched: "medium",
  fullscreen_exited: "low",
  looking_away: "low",
  microphone_disconnected: "low",
  face_detected: "info",
  monitoring_started: "info",
  monitoring_stopped: "info",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  info: "Info",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const DEMO_EXAM_ID = "exam-ai-fundamentals";

export const DEMO_CREDENTIALS = {
  student: { email: "aarav.sharma@demo.edu", password: "demo1234" },
  admin: { email: "admin@demo.edu", password: "admin1234" },
};

export const STUDENT_NAV = [
  { to: "/student/dashboard", label: "Dashboard", icon: "layout" },
  { to: "/student/exams", label: "Exams", icon: "list" },
  { to: "/student/demo-quiz", label: "Demo Quiz", icon: "play" },
  { to: "/student/history", label: "Exam History", icon: "history" },
  { to: "/student/profile", label: "Profile", icon: "user" },
] as const;

export const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "layout" },
  { to: "/admin/monitoring", label: "Live Monitoring", icon: "activity" },
  { to: "/admin/students", label: "Students", icon: "users" },
  { to: "/admin/exams", label: "Exams", icon: "file" },
  { to: "/admin/questions", label: "Questions", icon: "help" },
  { to: "/admin/evidence", label: "Evidence", icon: "image" },
  { to: "/admin/reports", label: "Reports", icon: "chart" },
  { to: "/admin/testing", label: "Testing Mode", icon: "flask" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
] as const;