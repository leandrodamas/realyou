
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";
import { useStartCamera } from "./useStartCamera";
import { useCameraCleanup } from "./useCameraCleanup";
import { useCameraRetry } from "./useCameraRetry";

export const useCameraStreaming = (isCameraActive: boolean) => {
  const {
    videoRef,
    streamRef,
    mountedRef,
    setIsLoading,
    handleCameraError,
    setIsVideoReady,
    facingMode,
    retryCountRef,
    resetRetryCount,
    incrementRetryCount,
    hasReachedMaxRetries,
    resetError
  } = useCameraState(isCameraActive);

  // Use the startCamera hook
  const { startCamera } = useStartCamera(
    isCameraActive,
    facingMode,
    videoRef,
    streamRef,
    mountedRef,
    setIsLoading,
    setIsVideoReady,
    resetError,
    handleCameraError,
    incrementRetryCount,
    resetRetryCount
  );

  // Start camera when active state changes
  useEffect(() => {
    if (isCameraActive) {
      console.log("useCameraStreaming: Câmera ativada, iniciando...");
      startCamera();
    } else {
      console.log("useCameraStreaming: Câmera desativada");
    }
  }, [isCameraActive, facingMode, startCamera]);
  
  // Handle camera cleanup
  useCameraCleanup(isCameraActive, streamRef, videoRef);
  
  // Handle camera retry logic
  useCameraRetry(isCameraActive, hasReachedMaxRetries, startCamera, videoRef, mountedRef);

  return;
};
