
import { useState, useRef, useEffect } from "react";
import { useCameraError } from "./useCameraError";
import { cleanupCameraStream } from "../utils/cameraUtils";

export const useCameraState = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [faceDetected, setFaceDetected] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mountedRef = useRef<boolean>(true);
  
  // Use the camera error hook directly
  const {
    hasError,
    errorMessage,
    lastErrorMessage,
    errorType,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries
  } = useCameraError();

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
    setHasError: resetError,
    errorMessage,
    errorType,
    lastErrorMessage,
    handleCameraError,
    facingMode,
    setFacingMode,
    faceDetected,
    setFaceDetected,
    isVideoReady,
    setIsVideoReady,
    retryCountRef
  };
};
