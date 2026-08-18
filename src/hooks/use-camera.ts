import { useCallback, useEffect, useRef, useState } from "react";

export type PermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<PermissionState>("idle");
  const [micState, setMicState] = useState<PermissionState>("idle");

  const attach = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play().catch(() => undefined);
    }
  }, []);

  const requestCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setCameraState("unavailable");
      return false;
    }
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      attach(stream);
      setCameraState("granted");
      return true;
    } catch {
      setCameraState("denied");
      return false;
    }
  }, [attach]);

  const requestMicrophone = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setMicState("unavailable");
      return false;
    }
    setMicState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicState("granted");
      return true;
    } catch {
      setMicState("denied");
      return false;
    }
  }, []);

  const stopAll = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopAll, [stopAll]);

  const bindVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (el && streamRef.current) {
        el.srcObject = streamRef.current;
        void el.play().catch(() => undefined);
      }
    },
    [],
  );

  return { bindVideo, requestCamera, requestMicrophone, stopAll, cameraState, micState };
}