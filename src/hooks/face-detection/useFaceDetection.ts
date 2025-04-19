
import { useState, useEffect, useRef } from 'react';
import { analyzeBrightness } from './utils/brightnessUtils';
import { analyzeVideoFrame } from './utils/frameUtils';

interface UseFaceDetectionProps {
  isCameraActive: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady?: boolean;
}

export const useFaceDetection = ({
  isCameraActive,
  isInitializing,
  isLoading,
  videoRef,
  isVideoReady = false
}: UseFaceDetectionProps) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const mountedRef = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveDetectionsRef = useRef<number>(0);
  const consecutiveNonDetectionsRef = useRef<number>(0);
  const detectionStabilityThreshold = 1;

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
    clearDetectionInterval();
    
    const shouldDetect = isCameraActive && 
                       !isInitializing && 
                       !isLoading && 
                       videoRef.current && 
                       (videoRef.current.readyState >= 2 || isVideoReady);
    
    if (shouldDetect) {
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 500 : 300;
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        if (!videoRef.current.videoWidth || videoRef.current.readyState < 2) {
          return;
        }
        
        try {
          const centerRegion = analyzeVideoFrame(videoRef.current);
          if (!centerRegion) return;

          const { brightnessFactor, variationFactor } = analyzeBrightness(centerRegion);
          const detected = brightnessFactor || variationFactor;
          
          if (detected) {
            consecutiveDetectionsRef.current++;
            consecutiveNonDetectionsRef.current = 0;
            
            if (consecutiveDetectionsRef.current >= detectionStabilityThreshold && !faceDetected && mountedRef.current) {
              setFaceDetected(true);
            }
          } else {
            consecutiveNonDetectionsRef.current++;
            consecutiveDetectionsRef.current = 0;
            
            if (consecutiveNonDetectionsRef.current >= detectionStabilityThreshold + 1 && faceDetected && mountedRef.current) {
              setFaceDetected(false);
            }
          }
        } catch (error) {
          console.error("Face detection error:", error);
        }
      }, intervalTime);
    } else if (!shouldDetect && faceDetected) {
      setFaceDetected(false);
      consecutiveDetectionsRef.current = 0;
      consecutiveNonDetectionsRef.current = 0;
    }
    
    return clearDetectionInterval;
  }, [isCameraActive, isInitializing, isLoading, videoRef, isVideoReady, faceDetected]);

  return { faceDetected };
};
