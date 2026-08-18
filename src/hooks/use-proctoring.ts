import { useCallback, useEffect, useRef, useState } from "react";
import { proctoringService } from "@/services/proctoring-service";
import type { ProctorEvent, ProctorEventType, ProctorStatus } from "@/types";

interface UseProctoringOptions {
  sessionId: string;
  examId: string;
  studentId: string;
  /** Poll interval for status refresh (a real backend also receives frames). */
  pollMs?: number;
  autoStart?: boolean;
}

export function useProctoring({
  sessionId,
  examId,
  studentId,
  pollMs = 4000,
  autoStart = true,
}: UseProctoringOptions) {
  const [status, setStatus] = useState<ProctorStatus | null>(null);
  const [events, setEvents] = useState<ProctorEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const [nextStatus, nextEvents] = await Promise.all([
        proctoringService.getStatus(sessionId),
        proctoringService.getEvents(sessionId),
      ]);
      setStatus(nextStatus);
      setEvents(nextEvents);
    } catch {
      setError("Monitoring service unavailable. Retrying…");
    }
  }, [sessionId]);

  useEffect(() => {
    if (!autoStart || started.current) return;
    started.current = true;
    proctoringService
      .start({ session_id: sessionId, exam_id: examId, student_id: studentId })
      .then(() => refresh())
      .catch(() => setError("Could not start monitoring session."));
  }, [autoStart, sessionId, examId, studentId, refresh]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void proctoringService
        .submitFrame({ session_id: sessionId, captured_at: new Date().toISOString() })
        .then(() => refresh());
    }, pollMs);
    return () => window.clearInterval(id);
  }, [sessionId, pollMs, refresh]);

  const simulate = useCallback(
    async (type: ProctorEventType) => {
      const result = await proctoringService.simulateEvent(sessionId, type);
      setStatus(result.status);
      setEvents((prev) => [...prev, result.event]);
      return result;
    },
    [sessionId],
  );

  const setDeviceState = useCallback(
    async (patch: Partial<Pick<ProctorStatus, "camera" | "microphone" | "monitoring">>) => {
      setStatus(await proctoringService.setDeviceState(sessionId, patch));
    },
    [sessionId],
  );

  const stop = useCallback(async () => {
    const next = await proctoringService.stop(sessionId);
    setStatus(next);
    await refresh();
    return next;
  }, [sessionId, refresh]);

  return { status, events, error, simulate, setDeviceState, stop, refresh };
}