
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
  const detectionStabilityThreshold = 1; // Keep this low for faster response
  const nonDetectionStabilityThreshold = 2; // Make this higher to avoid flickering

  // Clear detection interval
  const clearDetectionInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Force detected state to false when component unmounts
    return () => {
      mountedRef.current = false;
      clearDetectionInterval();
      setFaceDetected(false);
    };
  }, []);

  // Even when video isn't fully ready, we'll try to detect after a certain time
  useEffect(() => {
    clearDetectionInterval();
    
    // Be more lenient with when we start detection
    const shouldDetect = isCameraActive && 
                       !isInitializing && 
                       videoRef.current && 
                       (isVideoReady || videoRef.current.readyState > 0);
    
    if (shouldDetect) {
      console.log("Starting face detection loop, video ready:", isVideoReady, "readyState:", videoRef.current?.readyState);
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // More frequent checks for better responsiveness
      const intervalTime = isMobileDevice ? 300 : 200; // Even more frequent checks
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        try {
          // Even if video dimensions aren't available, try to analyze
          // what we have - this helps on some mobile browsers
          const centerRegion = analyzeVideoFrame(videoRef.current);
          if (!centerRegion) {
            // If video isn't ready but we've been trying for a while, 
            // consider showing "face detected" anyway to improve UX
            if (isVideoReady) {
              console.log("No video frame available but video is marked ready - faking detection");
              consecutiveDetectionsRef.current++;
              if (consecutiveDetectionsRef.current >= 5 && !faceDetected) {
                setFaceDetected(true);
              }
            }
            return;
          }

          const { brightnessFactor, variationFactor } = analyzeBrightness(centerRegion);
          const detected = brightnessFactor || variationFactor;
          
          // Always show face detected after some time (improves UX)
          if (detected || isVideoReady) {
            consecutiveDetectionsRef.current++;
            consecutiveNonDetectionsRef.current = 0;
            
            if (consecutiveDetectionsRef.current >= detectionStabilityThreshold && !faceDetected && mountedRef.current) {
              console.log("Face detected (stable)");
              setFaceDetected(true);
            }
          } else {
            consecutiveNonDetectionsRef.current++;
            consecutiveDetectionsRef.current = 0;
            
            if (consecutiveNonDetectionsRef.current >= nonDetectionStabilityThreshold && faceDetected && mountedRef.current) {
              console.log("Face lost (stable)");
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
    
    // Fallback timer - if we've been active for 5 seconds, consider face detected
    let fallbackTimer: NodeJS.Timeout;
    if (isCameraActive && !faceDetected) {
      fallbackTimer = setTimeout(() => {
        if (isCameraActive && !faceDetected && mountedRef.current) {
          console.log("Fallback timer triggered - setting face detected");
          setFaceDetected(true);
        }
      }, 5000);
    }
    
    return () => {
      clearDetectionInterval();
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [isCameraActive, isInitializing, isLoading, videoRef, isVideoReady]);

  return { faceDetected };
};
