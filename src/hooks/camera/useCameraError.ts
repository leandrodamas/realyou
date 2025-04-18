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
      errorMessage = "Câmera está sendo usada por outro aplicativo";
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    setLastErrorMessage(errorMessage);
    setHasError(true);
    toast.error(errorMessage);
  };

  const resetError = () => {
    setHasError(false);
    setLastErrorMessage(null);
  };

  return {
    hasError,
    lastErrorMessage,
    retryCountRef,
    handleCameraError,
    resetError
  };
};
