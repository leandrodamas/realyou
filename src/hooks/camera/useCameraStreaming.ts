
import { useEffect, useCallback } from "react";
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

  const startCamera = useCallback(async () => {
    if (!isCameraActive) return;

    console.log("Iniciando câmera com facingMode:", facingMode);
    setIsLoading(true);
    setIsVideoReady(false);

    // Reset retry counter when trying new camera access
    resetRetryCount();

    let timeoutId: NodeJS.Timeout;
    
    try {
      // Set a longer timeout for final fallback
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Timeout final de inicialização da câmera - forçando estado de pronto");
          setIsLoading(false);
          setIsVideoReady(true);
        }
      }, 10000);

      // Determinar se estamos em um dispositivo móvel para ajustar as configurações
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      // Configurações simplificadas
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode,
          width: { ideal: isMobile ? 640 : 1280 },
          height: { ideal: isMobile ? 480 : 720 }
        }
      };

      console.log("Tentativa de inicialização da câmera com configurações:", JSON.stringify(constraints));
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // Limpar timeouts se o stream foi obtido com sucesso
      clearTimeout(timeoutId);
      
      if (stream && videoRef.current && mountedRef.current) {
        console.log("Stream da câmera obtido com sucesso");
        streamRef.current = stream;
        setupVideoElement(videoRef.current, stream);
        
        // Adicionar um pequeno atraso antes de atualizar o estado
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("Configurando video como pronto");
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }, 500);
      }
    } catch (error: any) {
      console.error("Erro de acesso à câmera:", error);
      if (mountedRef.current) {
        handleCameraError(error);
        setIsLoading(false);
      }
    }
  }, [isCameraActive, facingMode]);

  useEffect(() => {
    if (isCameraActive) {
      console.log("useCameraStreaming: Iniciando câmera");
      startCamera();
    }
    
    return () => {
      // Limpa recursos quando o componente é desmontado ou o estado ativo muda
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.error("Erro ao parar trilha:", e);
          }
        });
      }
      
      if (videoRef.current) {
        try {
          videoRef.current.srcObject = null;
        } catch (e) {
          console.error("Erro ao limpar srcObject:", e);
        }
      }
    };
  }, [isCameraActive, facingMode]);

  return;
};
