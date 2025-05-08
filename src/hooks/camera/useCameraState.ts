
import { useRef, useState, useCallback, useEffect } from "react";

export const useCameraState = (isCameraActive: boolean = true) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef<boolean>(true);
  const retryCountRef = useRef<number>(0);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  const handleCameraError = useCallback((error: any) => {
    console.error("Camera error:", error);
    setHasError(true);
    
    if (errorMessage) {
      setLastErrorMessage(errorMessage);
    }
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setErrorMessage("Permissão para câmera negada. Por favor, permita o acesso à câmera nas configurações.");
      setErrorType("permission");
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      setErrorMessage("Nenhuma câmera encontrada neste dispositivo.");
      setErrorType("notFound");
      setHasCamera(false);
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      setErrorMessage("A câmera está sendo usada por outro aplicativo.");
      setErrorType("inUse");
    } else {
      setErrorMessage(`Erro ao acessar a câmera: ${error.message || 'Erro desconhecido'}`);
      setErrorType("unknown");
    }
  }, [errorMessage]);

  const resetError = useCallback(() => {
    setHasError(false);
    setErrorMessage(null);
    setErrorType(null);
  }, []);

  const incrementRetryCount = useCallback(() => {
    retryCountRef.current += 1;
    console.log("Incrementando contagem de tentativas para:", retryCountRef.current);
  }, []);

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  const hasReachedMaxRetries = useCallback(() => {
    return retryCountRef.current >= 3;
  }, []);
  
  const resetState = useCallback(() => {
    setIsVideoReady(false);
    resetError();
    resetRetryCount();
  }, [resetError, resetRetryCount]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    videoRef,
    streamRef,
    mountedRef,
    hasCamera,
    setHasCamera,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    lastErrorMessage,
    errorType,
    setErrorType,
    facingMode,
    setFacingMode,
    isLoading,
    setIsLoading,
    isVideoReady,
    setIsVideoReady,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries,
    resetState
  };
};
