
import { useState, useEffect, useRef } from 'react';

interface UseLoadingProps {
  isCameraActive: boolean;
}

export const useLoading = ({ isCameraActive }: UseLoadingProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    if (isCameraActive) {
      setIsInitializing(true);
      
      // Loading progress simulation
      let progress = 0;
      interval = setInterval(() => {
        progress += 5;
        if (progress > 95) {
          clearInterval(interval);
          progress = 95;
        }
        if (mountedRef.current) {
          setLoadingProgress(progress);
        }
      }, 100);

      // Camera initialization delay
      timer = setTimeout(() => {
        if (mountedRef.current) {
          setIsInitializing(false);
          setLoadingProgress(100);
        }
      }, 1500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive]);

  return {
    isInitializing,
    loadingProgress
  };
};
