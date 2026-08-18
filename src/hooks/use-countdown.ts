import { useEffect, useRef, useState } from "react";

export function useCountdown(totalSeconds: number, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const expired = useRef(false);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (!expired.current) {
            expired.current = true;
            expireRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return {
    remaining,
    elapsed: totalSeconds - remaining,
    pause: () => setRunning(false),
    resume: () => setRunning(true),
    running,
  };
}