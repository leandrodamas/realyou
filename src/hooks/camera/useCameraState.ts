
import { useRef, useState } from "react";
import { useCameraError } from "./useCameraError";

export const useCameraState = (isCameraActive: boolean = true) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef<boolean>(true);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  // Use the extracted error handling hook
  const cameraErrorState = useCameraError();

  const {
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    lastErrorMessage,
    setLastErrorMessage,
    errorType,
    setErrorType,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries
  } = cameraErrorState;

  const resetState = () => {
    setIsVideoReady(false);
    resetError();
    resetRetryCount();
  };

  return {
    videoRef,
    streamRef,
    mountedRef,
    hasCamera,
    setHasCamera,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    lastErrorMessage,
    setLastErrorMessage,
    errorType,
    setErrorType,
    facingMode,
    setFacingMode,
    isLoading,
    setIsLoading,
    isVideoReady,
    setIsVideoReady,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries,
    resetState
  };
};
