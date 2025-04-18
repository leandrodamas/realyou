
import { useState, useEffect, useRef } from 'react';

interface UseLoadingProps {
  isCameraActive: boolean;
}

export const useLoading = ({ isCameraActive }: UseLoadingProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountedRef = useRef<boolean>(true);
  const timersRef = useRef<{
    progressInterval?: NodeJS.Timeout;
    initializationTimer?: NodeJS.Timeout;
  }>({});

  // Cleanup function to clear all timers
  const cleanupTimers = () => {
    if (timersRef.current.progressInterval) {
      clearInterval(timersRef.current.progressInterval);
      timersRef.current.progressInterval = undefined;
    }
    if (timersRef.current.initializationTimer) {
      clearTimeout(timersRef.current.initializationTimer);
      timersRef.current.initializationTimer = undefined;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupTimers();
    };
  }, []);

  useEffect(() => {
    // Clean up previous timers
    cleanupTimers();
    
    if (isCameraActive) {
      setIsInitializing(true);
      
      // Loading progress simulation with adaptive timing
      let progress = 0;
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const progressInterval = isMobileDevice ? 150 : 100;
      const initDelay = isMobileDevice ? 2200 : 1500;
      
      timersRef.current.progressInterval = setInterval(() => {
        // Make progress slower at the beginning and faster toward the end
        const increment = progress < 50 ? 3 : progress < 80 ? 5 : 2;
        progress += increment;
        
        if (progress > 95) {
          if (timersRef.current.progressInterval) {
            clearInterval(timersRef.current.progressInterval);
            timersRef.current.progressInterval = undefined;
          }
          progress = 95;
        }
        
        if (mountedRef.current) {
          setLoadingProgress(progress);
        }
      }, progressInterval);

      // Camera initialization delay
      timersRef.current.initializationTimer = setTimeout(() => {
        if (mountedRef.current) {
          setIsInitializing(false);
          setLoadingProgress(100);
          cleanupTimers();
        }
      }, initDelay);
    } else {
      // Reset states when camera is deactivated
      setLoadingProgress(0);
      setIsInitializing(false);
    }
    
    return cleanupTimers;
  }, [isCameraActive]);

  return {
    isInitializing,
    loadingProgress
  };
};
