
import { useCameraState } from "./camera/useCameraState";
import { useCameraInitialization } from "./camera/useCameraInitialization";
import { useVideoMonitoring } from "./camera/useVideoMonitoring";
import { useCameraStreaming } from "./camera/useCameraStreaming";
import { useFaceDetection } from "./face-detection/useFaceDetection";
import type { CameraStreamState } from "./camera/types";

export const useCameraStream = (isCameraActive: boolean = true): CameraStreamState => {
  const {
    videoRef,
    hasError,
    hasCamera,
    isLoading,
    errorMessage,
    errorType,
    lastErrorMessage,
    facingMode,
    setFacingMode,
    isVideoReady,
    retryCountRef
  } = useCameraState(isCameraActive);

  // Initialize camera and check availability
  useCameraInitialization(isCameraActive);

  // Handle camera streaming
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

  const switchCamera = () => {
    if (!isLoading) {
      setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
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
