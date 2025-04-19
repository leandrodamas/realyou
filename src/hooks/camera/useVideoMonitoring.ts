
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";
import { ensureVideoPlaying } from "./utils/cameraOperations";

export const useVideoMonitoring = (isCameraActive: boolean, hasError: boolean) => {
  const { videoRef } = useCameraState(isCameraActive);

  useEffect(() => {
    if (!isCameraActive || !videoRef.current || hasError) return;

    const checkInterval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.paused && video.srcObject) {
        console.log("Video is paused but should be playing, attempting to restart");
        ensureVideoPlaying(video);
      }
      
      if (video) {
        console.log("Video status:", {
          readyState: video.readyState,
          paused: video.paused, 
          width: video.videoWidth,
          height: video.videoHeight
        });
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isCameraActive, hasError]);
};
