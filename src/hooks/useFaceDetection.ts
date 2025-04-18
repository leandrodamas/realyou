
import { useState, useEffect, useRef } from 'react';

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
  const mountedRef = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear detection interval
  const clearDetectionInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearDetectionInterval();
    };
  }, []);

  useEffect(() => {
    // Clean up previous interval
    clearDetectionInterval();
    
    const shouldDetect = isCameraActive && 
                         !isInitializing && 
                         !isLoading && 
                         videoRef.current && 
                         videoRef.current.readyState >= 2; // HAVE_CURRENT_DATA or better
    
    if (shouldDetect) {
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 800 : 500;
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        try {
          // In a real implementation, this would run face detection on the video stream
          // For now, we simulate with random values but with a bias toward true (70% chance)
          const detected = Math.random() < 0.7;
          
          if (mountedRef.current) {
            setFaceDetected(detected);
          }
        } catch (error) {
          console.error("Face detection error:", error);
          // Don't update state on errors to avoid flickering
        }
      }, intervalTime);
    } else if (!shouldDetect && faceDetected) {
      // Reset face detection when conditions aren't met
      setFaceDetected(false);
    }
    
    return clearDetectionInterval;
  }, [isCameraActive, isInitializing, isLoading, videoRef, faceDetected]);

  return { faceDetected };
};
