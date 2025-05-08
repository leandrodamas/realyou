
import { useEffect } from "react";

/**
 * Hook that handles camera retry logic when initial attempt fails
 */
export const useCameraRetry = (
  isCameraActive: boolean,
  hasReachedMaxRetries: () => boolean,
  startCamera: () => Promise<void>,
  videoRef: React.RefObject<HTMLVideoElement>,
  mountedRef: React.RefObject<boolean>
) => {
  useEffect(() => {
    if (!isCameraActive || hasReachedMaxRetries()) return;
    
    const checkVideoTimeout = setTimeout(() => {
      const video = videoRef.current;
      if (video && (!video.srcObject || video.videoWidth === 0) && mountedRef.current) {
        console.log("useCameraRetry: Câmera não inicializou, tentando reiniciar");
        startCamera();
      }
    }, 2500);
    
    return () => clearTimeout(checkVideoTimeout);
  }, [isCameraActive, hasReachedMaxRetries, startCamera, videoRef, mountedRef]);
};
