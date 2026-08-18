import { DEMO_EXAM_ID, EVENT_LABEL } from "@/constants";
import { riskLevelFor, severityFor, riskImpactFor } from "@/services/risk-engine";
import type {
  Evidence,
  Exam,
  ExamSession,
  LiveSession,
  ProctorEvent,
  ProctorEventType,
  Question,
  Report,
  Student,
} from "@/types";

/** All records below are clearly-marked DEMO data used until the backend is connected. */

const now = () => new Date();
const iso = (offsetMinutes: number) => new Date(Date.now() + offsetMinutes * 60_000).toISOString();
const isoDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();

export const demoStudents: Student[] = [
  {
    id: "stu-1",
    user_id: "usr-1",
    student_code: "CS21-0148",
    full_name: "Aarav Sharma",
    email: "aarav.sharma@demo.edu",
    program: "B.Tech Computer Science",
    year: 3,
    is_active: true,
    created_at: isoDays(-420),
  },
  {
    id: "stu-2",
    user_id: "usr-2",
    student_code: "CS21-0203",
    full_name: "Riya Patel",
    email: "riya.patel@demo.edu",
    program: "B.Tech Computer Science",
    year: 3,
    is_active: true,
    created_at: isoDays(-418),
  },
  {
    id: "stu-3",
    user_id: "usr-3",
    student_code: "CS20-0091",
    full_name: "Aditya Verma",
    email: "aditya.verma@demo.edu",
    program: "B.Tech Information Technology",
    year: 4,
    is_active: true,
    created_at: isoDays(-760),
  },
  {
    id: "stu-4",
    user_id: "usr-4",
    student_code: "CS22-0317",
    full_name: "Ananya Singh",
    email: "ananya.singh@demo.edu",
    program: "M.Sc Data Science",
    year: 2,
    is_active: true,
    created_at: isoDays(-260),
  },
  {
    id: "stu-5",
    user_id: "usr-5",
    student_code: "CS21-0455",
    full_name: "Rahul Mehta",
    email: "rahul.mehta@demo.edu",
    program: "B.Tech Computer Science",
    year: 3,
    is_active: false,
    created_at: isoDays(-430),
  },
  {
    id: "stu-6",
    user_id: "usr-6",
    student_code: "CS22-0512",
    full_name: "Kavya Nair",
    email: "kavya.nair@demo.edu",
    program: "B.Tech Electronics",
    year: 2,
    is_active: true,
    created_at: isoDays(-190),
  },
];

export const demoExams: Exam[] = [
  {
    id: DEMO_EXAM_ID,
    title: "AI Fundamentals — Proctored Assessment",
    subject: "Artificial Intelligence",
    description:
      "Open demonstration assessment covering core AI, search and machine-learning concepts. Proctoring signals run in demo mode.",
    duration_minutes: 15,
    total_questions: 10,
    starts_at: isoDays(-1),
    ends_at: isoDays(30),
    status: "published",
    reveal_answers: true,
    proctoring_enabled: true,
    created_by: "adm-1",
    created_at: isoDays(-40),
  },
  {
    id: "exam-data-structures",
    title: "Data Structures — Mid Semester",
    subject: "Data Structures",
    description: "Arrays, linked lists, trees, hashing and complexity analysis.",
    duration_minutes: 60,
    total_questions: 40,
    starts_at: iso(90),
    ends_at: iso(150),
    status: "published",
    reveal_answers: false,
    proctoring_enabled: true,
    created_by: "adm-1",
    created_at: isoDays(-22),
  },
  {
    id: "exam-ml-basics",
    title: "Machine Learning Basics — Unit Test",
    subject: "Machine Learning",
    description: "Supervised learning, evaluation metrics and regularisation.",
    duration_minutes: 45,
    total_questions: 30,
    starts_at: isoDays(4),
    ends_at: isoDays(4),
    status: "published",
    reveal_answers: false,
    proctoring_enabled: true,
    created_by: "adm-1",
    created_at: isoDays(-15),
  },
  {
    id: "exam-networks",
    title: "Computer Networks — Final",
    subject: "Computer Networks",
    description: "Layered models, routing, TCP behaviour and network security.",
    duration_minutes: 90,
    total_questions: 50,
    starts_at: isoDays(11),
    ends_at: isoDays(11),
    status: "draft",
    reveal_answers: false,
    proctoring_enabled: true,
    created_by: "adm-1",
    created_at: isoDays(-6),
  },
];

type QuestionSeed = Omit<Question, "id" | "exam_id" | "position">;

const demoQuestionSeeds: QuestionSeed[] = [
  {
    prompt: "Which search strategy is guaranteed to find an optimal solution when step costs are uniform?",
    option_a: "Depth-first search",
    option_b: "Breadth-first search",
    option_c: "Greedy best-first search",
    option_d: "Hill climbing",
    correct_option: "B",
    marks: 1,
    difficulty: "easy",
  },
  {
    prompt: "A* search is admissible only when the heuristic function h(n) is:",
    option_a: "Always zero",
    option_b: "Never underestimating the true cost",
    option_c: "Never overestimating the true cost",
    option_d: "Randomly initialised",
    correct_option: "C",
    marks: 1,
    difficulty: "medium",
  },
  {
    prompt: "In supervised learning, the training set consists of:",
    option_a: "Inputs only",
    option_b: "Inputs paired with target labels",
    option_c: "Rewards from an environment",
    option_d: "Unlabelled clusters",
    correct_option: "B",
    marks: 1,
    difficulty: "easy",
  },
  {
    prompt: "Which metric is most appropriate for a highly imbalanced binary classification problem?",
    option_a: "Accuracy",
    option_b: "Mean squared error",
    option_c: "F1 score",
    option_d: "R-squared",
    correct_option: "C",
    marks: 1,
    difficulty: "medium",
  },
  {
    prompt: "Overfitting is best described as a model that:",
    option_a: "Performs poorly on both training and unseen data",
    option_b: "Performs well on training data but poorly on unseen data",
    option_c: "Has too few parameters to learn the task",
    option_d: "Converges faster than expected",
    correct_option: "B",
    marks: 1,
    difficulty: "easy",
  },
  {
    prompt: "Which activation function outputs values in the range (0, 1)?",
    option_a: "ReLU",
    option_b: "Tanh",
    option_c: "Sigmoid",
    option_d: "Leaky ReLU",
    correct_option: "C",
    marks: 1,
    difficulty: "easy",
  },
  {
    prompt: "In a convolutional neural network, pooling layers primarily:",
    option_a: "Increase spatial resolution",
    option_b: "Reduce spatial dimensions and add translation tolerance",
    option_c: "Add trainable classification weights",
    option_d: "Normalise gradients during backpropagation",
    correct_option: "B",
    marks: 2,
    difficulty: "medium",
  },
  {
    prompt: "The bias–variance decomposition implies that increasing model complexity typically:",
    option_a: "Increases bias and reduces variance",
    option_b: "Reduces bias and increases variance",
    option_c: "Reduces both bias and variance",
    option_d: "Has no effect on either term",
    correct_option: "B",
    marks: 2,
    difficulty: "hard",
  },
  {
    prompt: "Which technique reduces variance by training many models on bootstrapped samples?",
    option_a: "Bagging",
    option_b: "Boosting",
    option_c: "Dropout scheduling",
    option_d: "Label smoothing",
    correct_option: "A",
    marks: 2,
    difficulty: "hard",
  },
  {
    prompt: "In reinforcement learning, the discount factor gamma controls:",
    option_a: "The learning rate of gradient updates",
    option_b: "How strongly future rewards are valued",
    option_c: "The exploration probability",
    option_d: "The size of the replay buffer",
    correct_option: "B",
    marks: 2,
    difficulty: "medium",
  },
];

export const demoQuestions: Question[] = demoQuestionSeeds.map((seed, index) => ({
  ...seed,
  id: `q-demo-${index + 1}`,
  exam_id: DEMO_EXAM_ID,
  position: index + 1,
}));

export const demoOtherQuestions: Question[] = [
  {
    id: "q-ds-1",
    exam_id: "exam-data-structures",
    position: 1,
    prompt: "Average-case lookup complexity of a well-distributed hash table is:",
    option_a: "O(1)",
    option_b: "O(log n)",
    option_c: "O(n)",
    option_d: "O(n log n)",
    correct_option: "A",
    marks: 1,
    difficulty: "easy",
  },
  {
    id: "q-ds-2",
    exam_id: "exam-data-structures",
    position: 2,
    prompt: "Which traversal of a binary search tree yields keys in sorted order?",
    option_a: "Pre-order",
    option_b: "In-order",
    option_c: "Post-order",
    option_d: "Level-order",
    correct_option: "B",
    marks: 1,
    difficulty: "easy",
  },
  {
    id: "q-ml-1",
    exam_id: "exam-ml-basics",
    position: 1,
    prompt: "L2 regularisation penalises:",
    option_a: "The number of features used",
    option_b: "The squared magnitude of weights",
    option_c: "The absolute magnitude of weights",
    option_d: "The training set size",
    correct_option: "B",
    marks: 2,
    difficulty: "medium",
  },
];

export const demoSessions: ExamSession[] = [
  {
    id: "ses-1001",
    exam_id: "exam-data-structures",
    student_id: "stu-1",
    status: "submitted",
    started_at: isoDays(-12),
    submitted_at: isoDays(-12),
    time_spent_seconds: 3180,
    score: 78,
    correct_count: 31,
    incorrect_count: 9,
    attempted_count: 40,
    final_risk_score: 25,
    suspicious_event_count: 1,
  },
  {
    id: "ses-1002",
    exam_id: "exam-ml-basics",
    student_id: "stu-1",
    status: "submitted",
    started_at: isoDays(-5),
    submitted_at: isoDays(-5),
    time_spent_seconds: 2410,
    score: 84,
    correct_count: 25,
    incorrect_count: 5,
    attempted_count: 30,
    final_risk_score: 55,
    suspicious_event_count: 3,
  },
  {
    id: "ses-1003",
    exam_id: DEMO_EXAM_ID,
    student_id: "stu-1",
    status: "submitted",
    started_at: isoDays(-2),
    submitted_at: isoDays(-2),
    time_spent_seconds: 640,
    score: 70,
    correct_count: 7,
    incorrect_count: 3,
    attempted_count: 10,
    final_risk_score: 10,
    suspicious_event_count: 0,
  },
];

function makeEvent(
  sessionId: string,
  type: ProctorEventType,
  minutesAgo: number,
  runningScore: number,
  source: ProctorEvent["source"] = "demo_simulation",
): ProctorEvent {
  const impact = riskImpactFor(type);
  const after = Math.min(100, runningScore + impact);
  return {
    id: `evt-${sessionId}-${type}-${minutesAgo}`,
    session_id: sessionId,
    event_type: type,
    severity: severityFor(type),
    description: EVENT_LABEL[type],
    risk_impact: impact,
    risk_score_after: after,
    source,
    created_at: iso(-minutesAgo),
  };
}

function buildTimeline(sessionId: string, types: { type: ProctorEventType; minutesAgo: number }[]) {
  let score = 0;
  return types
    .slice()
    .sort((a, b) => b.minutesAgo - a.minutesAgo)
    .map((t) => {
      const event = makeEvent(sessionId, t.type, t.minutesAgo, score);
      score = event.risk_score_after;
      return event;
    });
}

export const demoLiveTimelines: Record<string, ProctorEvent[]> = {
  "ses-2001": buildTimeline("ses-2001", [
    { type: "monitoring_started", minutesAgo: 34 },
    { type: "face_detected", minutesAgo: 33 },
    { type: "looking_away", minutesAgo: 12 },
  ]),
  "ses-2002": buildTimeline("ses-2002", [
    { type: "monitoring_started", minutesAgo: 41 },
    { type: "face_detected", minutesAgo: 40 },
    { type: "looking_away", minutesAgo: 26 },
    { type: "tab_switched", minutesAgo: 18 },
    { type: "face_missing", minutesAgo: 6 },
  ]),
  "ses-2003": buildTimeline("ses-2003", [
    { type: "monitoring_started", minutesAgo: 28 },
    { type: "face_detected", minutesAgo: 27 },
    { type: "looking_away", minutesAgo: 20 },
    { type: "object_detected", minutesAgo: 9 },
    { type: "multiple_faces", minutesAgo: 3 },
  ]),
  "ses-2004": buildTimeline("ses-2004", [
    { type: "monitoring_started", minutesAgo: 22 },
    { type: "face_detected", minutesAgo: 21 },
    { type: "fullscreen_exited", minutesAgo: 14 },
    { type: "tab_switched", minutesAgo: 5 },
  ]),
  "ses-2005": buildTimeline("ses-2005", [
    { type: "monitoring_started", minutesAgo: 17 },
    { type: "face_detected", minutesAgo: 16 },
  ]),
};

function lastEventLabel(events: ProctorEvent[]): string {
  const last = events[events.length - 1];
  return last ? last.description : "No events recorded";
}

function scoreOf(sessionId: string): number {
  const events = demoLiveTimelines[sessionId] ?? [];
  const last = events[events.length - 1];
  return last ? last.risk_score_after : 0;
}

export const demoLiveSessions: LiveSession[] = [
  {
    session_id: "ses-2001",
    student_name: "Aarav Sharma",
    student_code: "CS21-0148",
    exam_title: "Data Structures — Mid Semester",
    camera: "connected",
    monitoring: "active",
    risk_score: scoreOf("ses-2001"),
    risk_level: riskLevelFor(scoreOf("ses-2001")),
    latest_event: lastEventLabel(demoLiveTimelines["ses-2001"] ?? []),
    last_activity: iso(-1),
    duration_seconds: 34 * 60,
    progress: 62,
  },
  {
    session_id: "ses-2002",
    student_name: "Riya Patel",
    student_code: "CS21-0203",
    exam_title: "Data Structures — Mid Semester",
    camera: "connected",
    monitoring: "active",
    risk_score: scoreOf("ses-2002"),
    risk_level: riskLevelFor(scoreOf("ses-2002")),
    latest_event: lastEventLabel(demoLiveTimelines["ses-2002"] ?? []),
    last_activity: iso(-2),
    duration_seconds: 41 * 60,
    progress: 71,
  },
  {
    session_id: "ses-2003",
    student_name: "Aditya Verma",
    student_code: "CS20-0091",
    exam_title: "Machine Learning Basics — Unit Test",
    camera: "connected",
    monitoring: "active",
    risk_score: scoreOf("ses-2003"),
    risk_level: riskLevelFor(scoreOf("ses-2003")),
    latest_event: lastEventLabel(demoLiveTimelines["ses-2003"] ?? []),
    last_activity: iso(-1),
    duration_seconds: 28 * 60,
    progress: 48,
  },
  {
    session_id: "ses-2004",
    student_name: "Ananya Singh",
    student_code: "CS22-0317",
    exam_title: "Machine Learning Basics — Unit Test",
    camera: "disconnected",
    monitoring: "paused",
    risk_score: scoreOf("ses-2004"),
    risk_level: riskLevelFor(scoreOf("ses-2004")),
    latest_event: lastEventLabel(demoLiveTimelines["ses-2004"] ?? []),
    last_activity: iso(-4),
    duration_seconds: 22 * 60,
    progress: 33,
  },
  {
    session_id: "ses-2005",
    student_name: "Kavya Nair",
    student_code: "CS22-0512",
    exam_title: "AI Fundamentals — Proctored Assessment",
    camera: "connected",
    monitoring: "active",
    risk_score: scoreOf("ses-2005"),
    risk_level: riskLevelFor(scoreOf("ses-2005")),
    latest_event: lastEventLabel(demoLiveTimelines["ses-2005"] ?? []),
    last_activity: iso(0),
    duration_seconds: 17 * 60,
    progress: 20,
  },
];

export const demoEvidence: Evidence[] = demoLiveSessions.flatMap((session) =>
  (demoLiveTimelines[session.session_id] ?? [])
    .filter((event) => event.severity === "medium" || event.severity === "high")
    .map((event) => ({
      id: `ev-${event.id}`,
      session_id: session.session_id,
      event_id: event.id,
      student_name: session.student_name,
      student_code: session.student_code,
      exam_title: session.exam_title,
      event_type: event.event_type,
      severity: event.severity,
      description: event.description,
      storage_path: null,
      captured_at: event.created_at,
    })),
);

export const demoReports: Report[] = [
  {
    id: "rep-1",
    report_type: "proctoring",
    title: "Proctoring summary — Data Structures Mid Semester",
    filters: { exam: "Data Structures — Mid Semester", range: "Last 7 days" },
    status: "ready",
    generated_by: "adm-1",
    generated_at: isoDays(-1),
  },
  {
    id: "rep-2",
    report_type: "suspicious_activity",
    title: "Suspicious activity review — all exams",
    filters: { risk: "Suspicious and above", range: "Last 30 days" },
    status: "ready",
    generated_by: "adm-1",
    generated_at: isoDays(-3),
  },
  {
    id: "rep-3",
    report_type: "exam",
    title: "Exam performance — Machine Learning Basics",
    filters: { exam: "Machine Learning Basics — Unit Test" },
    status: "queued",
    generated_by: "adm-1",
    generated_at: isoDays(0),
  },
];

/* ---------- Analytics series ---------- */

export const riskDistribution = [
  { level: "Normal", sessions: 128, fill: "var(--color-chart-1)" },
  { level: "Warning", sessions: 41, fill: "var(--color-chart-2)" },
  { level: "Suspicious", sessions: 17, fill: "var(--color-chart-3)" },
  { level: "High risk", sessions: 6, fill: "var(--color-chart-4)" },
];

export const eventsOverTime = Array.from({ length: 12 }, (_, i) => {
  const hour = 9 + i;
  const base = [4, 6, 9, 14, 11, 8, 13, 18, 15, 10, 7, 5];
  return {
    time: `${String(hour).padStart(2, "0")}:00`,
    events: base[i] ?? 5,
    high_severity: Math.max(0, Math.round((base[i] ?? 5) / 3) - 1),
  };
});

export const eventCategories = [
  { category: "Looking away", count: 96 },
  { category: "Tab switched", count: 54 },
  { category: "Face missing", count: 38 },
  { category: "Fullscreen exited", count: 27 },
  { category: "Object detected", count: 19 },
  { category: "Multiple faces", count: 11 },
];

export const examParticipation = [
  { exam: "AI Fundamentals", enrolled: 210, attempted: 186 },
  { exam: "Data Structures", enrolled: 180, attempted: 171 },
  { exam: "ML Basics", enrolled: 145, attempted: 132 },
  { exam: "Networks", enrolled: 160, attempted: 0 },
];

export const averageRiskTrend = Array.from({ length: 14 }, (_, i) => {
  const day = new Date(Date.now() - (13 - i) * 86_400_000);
  const values = [18, 22, 19, 25, 31, 28, 24, 27, 33, 29, 26, 23, 21, 24];
  return {
    day: day.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    average_risk: values[i] ?? 22,
  };
});

export const dashboardMetrics = {
  total_students: 486,
  active_exams: 3,
  active_sessions: demoLiveSessions.length,
  normal: demoLiveSessions.filter((s) => s.risk_level === "normal").length,
  warning: demoLiveSessions.filter((s) => s.risk_level === "warning").length,
  suspicious: demoLiveSessions.filter((s) => s.risk_level === "suspicious").length,
  high_risk: demoLiveSessions.filter((s) => s.risk_level === "high_risk").length,
  generated_at: now().toISOString(),
};

export const studentRecentActivity = [
  { id: "act-1", label: "Submitted AI Fundamentals — Proctored Assessment", at: isoDays(-2) },
  { id: "act-2", label: "System check completed for Machine Learning Basics", at: isoDays(-5) },
  { id: "act-3", label: "Submitted Machine Learning Basics — Unit Test", at: isoDays(-5) },
  { id: "act-4", label: "Profile contact details updated", at: isoDays(-9) },
];