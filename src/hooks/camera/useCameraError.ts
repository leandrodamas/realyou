
import { useState, useRef } from 'react';
import { CameraErrorState } from './types';
import { toast } from 'sonner';

export const useCameraError = (): CameraErrorState => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const MAX_RETRIES = 3;

  const resetError = () => {
    setHasError(false);
    setErrorMessage(null);
    setErrorType(null);
  };

  const incrementRetryCount = () => {
    retryCountRef.current += 1;
  };

  const resetRetryCount = () => {
    retryCountRef.current = 0;
  };

  const hasReachedMaxRetries = () => {
    return retryCountRef.current >= MAX_RETRIES;
  };

  const handleCameraError = (error: any) => {
    console.error("Camera error:", error);
    setHasError(true);
    
    // Store the last error message for reference
    if (errorMessage) {
      setLastErrorMessage(errorMessage);
    }
    
    let message: string;
    let type: string;
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      message = "Permissão para acessar a câmera foi negada. Por favor, permita o acesso à câmera nas configurações.";
      type = "permission";
      toast.error("Permissão à câmera negada. Verifique as configurações do seu dispositivo.");
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      message = "Nenhuma câmera encontrada neste dispositivo.";
      type = "notFound";
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      message = "A câmera está sendo usada por outro aplicativo.";
      type = "inUse";
      toast.error("Câmera em uso por outro aplicativo. Feche outros aplicativos de câmera.");
    } else if (error.name === 'OverconstrainedError') {
      message = "As configurações solicitadas para a câmera não são suportadas.";
      type = "constraints";
    } else if (error.name === 'TypeError' && error.message?.includes('getUserMedia')) {
      message = "O navegador não suporta acesso à câmera.";
      type = "unsupported";
    } else {
      message = `Erro ao acessar a câmera: ${error.message || 'Erro desconhecido'}`;
      type = "unknown";
      toast.error("Problema ao acessar a câmera. Tente reiniciar o aplicativo.");
    }
    
    setErrorMessage(message);
    setErrorType(type);
  };

  return {
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    lastErrorMessage,
    setLastErrorMessage,
    errorType,
    setErrorType,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount,
    hasReachedMaxRetries
  };
};
