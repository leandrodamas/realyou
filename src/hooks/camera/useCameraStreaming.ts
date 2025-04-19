
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";
import { initializeVideoStream, setupVideoElement } from "./utils/cameraOperations";

export const useCameraStreaming = (isCameraActive: boolean) => {
  const {
    videoRef,
    streamRef,
    mountedRef,
    setIsLoading,
    handleCameraError,
    setIsVideoReady,
    facingMode,
    retryCountRef,
    resetRetryCount
  } = useCameraState(isCameraActive);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let shortTimeoutId: NodeJS.Timeout;
    
    const startCamera = async () => {
      if (!isCameraActive) return;

      setIsLoading(true);
      setIsVideoReady(false);

      // Reset retry counter when trying new camera access
      resetRetryCount();

      // Set a short timeout to ensure the UI shows loading state
      shortTimeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Timeout inicial de inicialização da câmera - configurando vídeo como pronto");
          setIsVideoReady(true);
        }
      }, 3000);

      // Set a longer timeout for final fallback
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Timeout final de inicialização da câmera - forçando estado de pronto");
          setIsLoading(false);
          setIsVideoReady(true);
        }
      }, 6000);

      try {
        // Adicionar um pequeno atraso para garantir que o UI seja atualizado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };

        console.log("Inicializando câmera com configurações:", JSON.stringify(constraints));
        const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
        
        if (stream && videoRef.current && mountedRef.current) {
          console.log("Stream da câmera obtido com sucesso");
          streamRef.current = stream;
          setupVideoElement(videoRef.current, stream);
          
          if (mountedRef.current) {
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Erro de acesso à câmera:", error);
        if (mountedRef.current) {
          handleCameraError(error);
          setIsLoading(false);
        }
      }
    };

    if (isCameraActive) {
      startCamera();
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (shortTimeoutId) clearTimeout(shortTimeoutId);
    };
  }, [isCameraActive, facingMode]);
};
