
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

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
  const consecutiveDetectionsRef = useRef<number>(0);
  const consecutiveNonDetectionsRef = useRef<number>(0);
  const detectionStabilityThreshold = 3; // Number of consecutive detections/non-detections to change state

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
      console.log("Starting face detection loop");
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 800 : 500;
      
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || !videoRef.current.videoWidth || !isCameraActive || !mountedRef.current) {
          clearDetectionInterval();
          return;
        }
        
        try {
          // Simplified face detection using brightness analysis
          // In a production app, this would be replaced with a real face detection API
          const detected = detectFaceFromVideo(videoRef.current);
          
          // Stabilize detection to avoid flickering
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
            
            if (consecutiveNonDetectionsRef.current >= detectionStabilityThreshold && faceDetected && mountedRef.current) {
              console.log("Face lost (stable)");
              setFaceDetected(false);
            }
          }
        } catch (error) {
          console.error("Face detection error:", error);
          // Don't update state on errors to avoid flickering
        }
      }, intervalTime);
    } else if (!shouldDetect && faceDetected) {
      // Reset face detection when conditions aren't met
      setFaceDetected(false);
      consecutiveDetectionsRef.current = 0;
      consecutiveNonDetectionsRef.current = 0;
    }
    
    return clearDetectionInterval;
  }, [isCameraActive, isInitializing, isLoading, videoRef]);

  // Simple face detection function that analyzes video frame to detect a face
  // This is a simplified version and should be replaced with a proper face detection algorithm
  const detectFaceFromVideo = (video: HTMLVideoElement): boolean => {
    try {
      // Create a temporary canvas to analyze the video frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return false;

      // Use a smaller region for analysis to improve performance
      const width = Math.min(video.videoWidth, 320);
      const height = Math.min(video.videoHeight, 240);
      const centerX = (video.videoWidth - width) / 2;
      const centerY = (video.videoHeight - height) / 2;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the center region of the video onto the canvas
      context.drawImage(
        video,
        centerX, centerY, width, height, // source rectangle
        0, 0, width, height               // destination rectangle
      );
      
      // Analyze the center region for face-like features
      // This is an extremely simplified algorithm that looks for:
      // 1. Brightness changes typical in faces (lighter in center, darker around edges)
      // 2. Color variations in the central area
      
      const centerRegion = context.getImageData(
        Math.floor(width * 0.3),
        Math.floor(height * 0.2),
        Math.floor(width * 0.4),
        Math.floor(height * 0.6)
      );
      
      const data = centerRegion.data;
      let totalBrightness = 0;
      let faceColorVariation = 0;
      let prevPixel = 0;
      
      // Calculate average brightness and color variation
      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel (16 bytes) for performance
        // Convert RGB to brightness
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        totalBrightness += brightness;
        
        // Calculate color variation between sampled pixels
        if (i > 0) {
          faceColorVariation += Math.abs(prevPixel - brightness);
        }
        prevPixel = brightness;
      }
      
      const avgBrightness = totalBrightness / (data.length / 16);
      const normalizedVariation = faceColorVariation / (data.length / 16);
      
      // Determine if face is likely present based on empirical thresholds
      // 1. Brightness is in a reasonable range (not too dark, not too bright)
      // 2. There is sufficient color variation (faces have features)
      const brightnessFactor = avgBrightness > 40 && avgBrightness < 220;
      const variationFactor = normalizedVariation > 5;
      
      const isLikelyFace = brightnessFactor && variationFactor;
      
      // For debugging
      if (Math.random() < 0.05) { // Log only occasionally to avoid console spam
        console.log(`Face detection stats - Brightness: ${avgBrightness.toFixed(1)}, Variation: ${normalizedVariation.toFixed(1)}, Result: ${isLikelyFace}`);
      }
      
      return isLikelyFace;
    } catch (e) {
      console.error("Error in face detection:", e);
      return false;
    }
  };

  return { faceDetected };
};
