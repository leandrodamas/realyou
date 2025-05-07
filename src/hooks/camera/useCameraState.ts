
import { useRef, useState } from "react";
import { useCameraAccess } from "./useCameraAccess";
import { useDeviceDetection } from "./useDeviceDetection";
import { useCameraError } from "./useCameraError";
import { CameraStreamState } from "./types";

export const useCameraState = (isCameraActive: boolean) => {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const mountedRef = useRef<boolean>(true);
  const streamRef = useRef<MediaStream | null>(null);
  const retryCountRef = useRef<number>(0);
  
  // Import necessary hooks
  const { videoRef, isLoading, setIsLoading, initializeCamera } = useCameraAccess(isCameraActive, facingMode);
  const { hasCamera, checkCameraAvailability } = useDeviceDetection();
  const { 
    hasError, 
    errorMessage,
    errorType,
    lastErrorMessage,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries 
  } = useCameraError();

  const resetState = () => {
    setIsVideoReady(false);
    resetError();
    resetRetryCount();
  };
  
  return {
    // Camera state
    videoRef,
    streamRef,
    facingMode,
    setFacingMode,
    isVideoReady,
    setIsVideoReady,
    mountedRef,
    
    // Device state
    hasCamera,
    checkCameraAvailability,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Error state
    hasError,
    errorMessage,
    errorType,
    lastErrorMessage,
    handleCameraError,
    resetError,
    
    // Retry state
    retryCountRef,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries,
    
    // Reset state
    resetState
  };
};
