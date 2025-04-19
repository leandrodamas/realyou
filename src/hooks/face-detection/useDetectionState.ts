
import { useState, useRef } from 'react';

interface UseDetectionStateProps {
  detectionStabilityThreshold?: number;
  nonDetectionStabilityThreshold?: number;
}

export const useDetectionState = ({ 
  detectionStabilityThreshold = 1,
  nonDetectionStabilityThreshold = 2 
}: UseDetectionStateProps = {}) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const consecutiveDetectionsRef = useRef<number>(0);
  const consecutiveNonDetectionsRef = useRef<number>(0);
  
  const updateDetectionState = (detected: boolean) => {
    if (detected) {
      consecutiveDetectionsRef.current++;
      consecutiveNonDetectionsRef.current = 0;
      
      if (consecutiveDetectionsRef.current >= detectionStabilityThreshold && !faceDetected) {
        console.log("Face detected (stable)");
        setFaceDetected(true);
      }
    } else {
      consecutiveNonDetectionsRef.current++;
      consecutiveDetectionsRef.current = 0;
      
      if (consecutiveNonDetectionsRef.current >= nonDetectionStabilityThreshold && faceDetected) {
        console.log("Face lost (stable)");
        setFaceDetected(false);
      }
    }
  };

  const resetDetectionState = () => {
    setFaceDetected(false);
    consecutiveDetectionsRef.current = 0;
    consecutiveNonDetectionsRef.current = 0;
  };

  return {
    faceDetected,
    updateDetectionState,
    resetDetectionState
  };
};
