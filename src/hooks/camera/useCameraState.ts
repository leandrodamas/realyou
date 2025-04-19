
import { useState, useRef, useEffect } from "react";
import { cleanupCameraStream } from "../utils/cameraUtils";

export const useCameraState = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [faceDetected, setFaceDetected] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (streamRef.current) {
        cleanupCameraStream(streamRef.current, videoRef.current);
      }
    };
  }, []);

  return {
    videoRef,
    streamRef,
    mountedRef,
    isLoading,
    setIsLoading,
    hasCamera,
    setHasCamera,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    facingMode,
    setFacingMode,
    faceDetected,
    setFaceDetected,
    isVideoReady,
    setIsVideoReady
  };
};
