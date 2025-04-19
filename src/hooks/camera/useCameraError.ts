
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CameraErrorState } from "./types";

export const useCameraError = (): CameraErrorState => {
  const [hasError, setHasError] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Auto-reset error after some time for specific error types
  useEffect(() => {
    let resetTimer: NodeJS.Timeout | null = null;
    
    // Only auto-reset for "NotReadableError" - camera in use errors
    // as these may resolve themselves when other apps release the camera
    if (hasError && errorType === 'NotReadableError' && retryCountRef.current < maxRetries) {
      resetTimer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCountRef.current + 1}/${maxRetries} for camera error`);
        resetError();
      }, 3000 * (retryCountRef.current + 1)); // Increasing backoff time for each retry
    }
    
    return () => {
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [hasError, errorType]);

  const handleCameraError = (error: any) => {
    let errorMessage = "Erro desconhecido ao acessar câmera";
    const errorName = error.name || "UnknownError";
    
    // Store the error type for conditional handling
    setErrorType(errorName);
    
    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      errorMessage = "Permissão para acessar câmera negada";
    } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      errorMessage = "Nenhuma câmera detectada no dispositivo";
    } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
      errorMessage = "Câmera está sendo usada por outro aplicativo. Feche outros aplicativos usando a câmera e tente novamente.";
      
      // Increment retry counter for this specific error
      incrementRetryCount();
      
      // Different message for repeated errors
      if (retryCountRef.current > 1) {
        errorMessage += ` (Tentativa ${retryCountRef.current}/${maxRetries})`;
      }
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    // Log detailed error information for debugging
    console.error("Camera error details:", {
      name: errorName,
      message: error.message,
      stack: error.stack,
      retryCount: retryCountRef.current,
      errorObject: error
    });
    
    setLastErrorMessage(errorMessage);
    setHasError(true);
    
    // Only show toast for first occurrence or every third retry
    if (retryCountRef.current === 0 || retryCountRef.current % 2 === 0) {
      toast.error(errorMessage, {
        duration: 5000,
        id: `camera-error-${errorName}-${retryCountRef.current}`
      });
    }
  };

  const resetError = () => {
    setHasError(false);
    setLastErrorMessage(null);
  };

  const incrementRetryCount = () => {
    retryCountRef.current += 1;
  };

  const resetRetryCount = () => {
    retryCountRef.current = 0;
  };

  const hasReachedMaxRetries = (): boolean => {
    return retryCountRef.current >= maxRetries;
  };

  return {
    hasError,
    lastErrorMessage,
    errorType,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries
  };
};
