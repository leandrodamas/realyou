
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
      // More frequent checks for better responsiveness
      const intervalTime = isMobileDevice ? 400 : 250; // Was 500/300
      
      // For debugging, attempt to log information about the video stream
      if (videoRef.current) {
        try {
          const videoTracks = (videoRef.current.srcObject as MediaStream)?.getVideoTracks();
          if (videoTracks && videoTracks.length > 0) {
            console.log("Video track settings:", videoTracks[0].getSettings());
          }
        } catch (e) {
          console.log("Could not log video track settings:", e);
        }
      }
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        // Skip if video dimensions aren't available yet
        if (!videoRef.current.videoWidth || videoRef.current.readyState < 2) {
          console.log("Video not fully ready for detection, dimensions:", 
            videoRef.current.videoWidth, "x", videoRef.current.videoHeight,
            "readyState:", videoRef.current.readyState);
          return;
        }
        
        try {
          const centerRegion = analyzeVideoFrame(videoRef.current);
          if (!centerRegion) return;

          const { brightnessFactor, variationFactor, avgBrightness, normalizedVariation } = analyzeBrightness(centerRegion);
          const detected = brightnessFactor || variationFactor;
          
          console.log("Face detection analysis:", {
            brightnessFactor,
            variationFactor,
            avgBrightness,
            normalizedVariation,
            detected
          });
          
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
    
    return clearDetectionInterval;
  }, [isCameraActive, isInitializing, isLoading, videoRef, isVideoReady]);

  return { faceDetected };
};
