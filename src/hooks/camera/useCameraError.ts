
import { useState, useRef } from "react";
import { toast } from "sonner";
import { CameraErrorState } from "./types";

export const useCameraError = (): CameraErrorState => {
  const [hasError, setHasError] = useState(false);
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const retryCountRef = useRef<number>(0);

  const handleCameraError = (error: any) => {
    let errorMessage = "Erro desconhecido ao acessar câmera";
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = "Permissão para acessar câmera negada";
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = "Nenhuma câmera detectada no dispositivo";
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      // Provide more specific error message for this common case
      errorMessage = "Câmera está sendo usada por outro aplicativo. Feche outros aplicativos usando a câmera e tente novamente.";
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    // Log detailed error information for debugging
    console.error("Camera error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errorObject: error
    });
    
    setLastErrorMessage(errorMessage);
    setHasError(true);
    toast.error(errorMessage, {
      duration: 5000, // Show error message longer
      id: `camera-error-${error.name}` // Prevent duplicate toasts
    });
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

  return {
    hasError,
    lastErrorMessage,
    retryCountRef,
    handleCameraError,
    resetError,
    incrementRetryCount,
    resetRetryCount
  };
};
