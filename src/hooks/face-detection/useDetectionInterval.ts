
import { useEffect, useRef } from 'react';
import { analyzeBrightness } from './utils/brightnessUtils';
import { analyzeVideoFrame } from './utils/frameUtils';

interface UseDetectionIntervalProps {
  isCameraActive: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady?: boolean;
  onDetectionUpdate: (detected: boolean) => void;
}

export const useDetectionInterval = ({
  isCameraActive,
  isInitializing,
  isLoading,
  videoRef,
  isVideoReady = false,
  onDetectionUpdate
}: UseDetectionIntervalProps) => {
  const mountedRef = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
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
          clearInterval(intervalRef.current!);
          return;
        }
        
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
          
          onDetectionUpdate(detected);
        } catch (error) {
          console.error("Face detection error:", error);
        }
      }, intervalTime);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraActive, isInitializing, isLoading, videoRef, isVideoReady, onDetectionUpdate]);
};
