
import { useState, useEffect } from 'react';

interface UseFaceDetectionProps {
  isCameraActive: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useFaceDetection = ({
  isCameraActive,
  isInitializing,
  isLoading,
  videoRef
}: UseFaceDetectionProps) => {
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    let detectInterval: NodeJS.Timeout;
    
    if (isCameraActive && !isInitializing && !isLoading && videoRef.current) {
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 800 : 500;
      
      detectInterval = setInterval(() => {
        if (!videoRef.current || !isCameraActive) {
          clearInterval(detectInterval);
          return;
        }
        const detected = Math.random() > 0.2;
        setFaceDetected(detected);
      }, intervalTime);
    }
    
    return () => {
      if (detectInterval) clearInterval(detectInterval);
    };
  }, [isCameraActive, isInitializing, isLoading, videoRef]);

  return { faceDetected };
};
