
import { useState, useEffect, useRef } from 'react';
import { useBrightnessAnalysis } from './face-detection/useBrightnessAnalysis';
import { useVideoFrameAnalysis } from './face-detection/useVideoFrameAnalysis';

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

  const { analyzeBrightness } = useBrightnessAnalysis();
  const { analyzeVideoFrame } = useVideoFrameAnalysis();

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
      console.log("Starting face detection loop, video ready:", isVideoReady);
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 500 : 300;
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        // Verificação adicional para garantir que o vídeo está pronto
        if (!videoRef.current.videoWidth || videoRef.current.readyState < 2) {
          console.log("Video not fully ready yet, skipping detection");
          return;
        }
        
        try {
          const centerRegion = analyzeVideoFrame(videoRef.current);
          if (!centerRegion) return;

          const { brightnessFactor, variationFactor } = analyzeBrightness(centerRegion);
          const detected = brightnessFactor || variationFactor;
          
          if (Math.random() < 0.2) {
            console.log("Face detection check:", detected ? "DETECTED" : "NOT DETECTED");
          }
          
          if (detected) {
            consecutiveDetectionsRef.current++;
            consecutiveNonDetectionsRef.current = 0;
            
            if (consecutiveDetectionsRef.current >= detectionStabilityThreshold && !faceDetected && mountedRef.current) {
              console.log("Face detected (stable)");
              setFaceDetected(true);
            }
          } else {
            consecutiveNonDetectionsRef.current++;
            consecutiveDetectionsRef.current = 0;
            
            if (consecutiveNonDetectionsRef.current >= detectionStabilityThreshold + 1 && faceDetected && mountedRef.current) {
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
    
    return clearDetectionInterval;
  }, [isCameraActive, isInitializing, isLoading, videoRef, isVideoReady]);

  return { faceDetected };
};
