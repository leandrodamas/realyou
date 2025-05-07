
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";

export const useVideoMonitoring = (isCameraActive: boolean, hasError: boolean) => {
  const {
    videoRef,
    mountedRef,
    isVideoReady,
    setIsVideoReady
  } = useCameraState(isCameraActive);

  // Monitor video status to detect when it's ready or has errors
  useEffect(() => {
    if (!isCameraActive || hasError || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleVideoReady = () => {
      if (mountedRef.current) {
        console.log("Video ready event triggered, video dimensions:", video.videoWidth, "x", video.videoHeight);
        setIsVideoReady(true);
      }
    };

    const handleError = (e: Event) => {
      console.error("Video element error event:", e);
    };

    // Events for video readiness
    video.addEventListener('loadedmetadata', handleVideoReady);
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('error', handleError);

    // Force ready state after a timeout
    const forceReadyTimeout = setTimeout(() => {
      if (mountedRef.current && !isVideoReady && video.srcObject) {
        console.log("Force setting video ready after timeout");
        setIsVideoReady(true);
      }
    }, 5000);

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoReady);
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('error', handleError);
      clearTimeout(forceReadyTimeout);
    };
  }, [isCameraActive, hasError, videoRef.current]);
};
