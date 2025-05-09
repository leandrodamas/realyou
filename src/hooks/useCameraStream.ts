
import { useCameraState } from "./camera/useCameraState";
import { useCameraInitialization } from "./camera/useCameraInitialization";
import { useVideoMonitoring } from "./camera/useVideoMonitoring";
import { useCameraStreaming } from "./camera/useCameraStreaming";
import { useFaceDetection } from "./face-detection/useFaceDetection";
import type { CameraStreamState } from "./camera/types";

export const useCameraStream = (isCameraActive: boolean = true): CameraStreamState => {
  // Get state from all camera hooks
  const {
    videoRef,
    hasError,
    errorMessage,
    errorType,
    lastErrorMessage,
    hasCamera,
    isLoading,
    facingMode,
    setFacingMode,
    isVideoReady,
    retryCountRef
  } = useCameraState(isCameraActive);

  // Initialize camera - ensures permissions are requested properly
  useCameraInitialization(isCameraActive);

  // Handle camera streaming - most important fix for rear camera activation
  useCameraStreaming(isCameraActive);

  // Monitor video status
  useVideoMonitoring(isCameraActive, hasError);

  // Handle face detection
  const { faceDetected } = useFaceDetection({
    isCameraActive,
    isInitializing: false,
    isLoading,
    videoRef,
    isVideoReady
  });

  // Switch camera function - ensures correct permissions are requested
  const switchCamera = () => {
    if (!isLoading) {
      // This will trigger the camera to reinitialize with the new facingMode
      setFacingMode(prevMode => {
        console.log(`Switching camera from ${prevMode} to ${prevMode === "user" ? "environment" : "user"}`);
        return prevMode === "user" ? "environment" : "user";
      });
    }
  };

  return {
    videoRef,
    hasError,
    switchCamera,
    facingMode,
    hasCamera,
    isLoading,
    errorMessage,
    lastErrorMessage,
    errorType,
    isVideoReady,
    faceDetected,
    retryCount: retryCountRef.current
  };
};
