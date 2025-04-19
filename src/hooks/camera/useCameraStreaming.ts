
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

    setIsLoading(true);
    setIsVideoReady(false);

    // Reset retry counter when trying new camera access
    resetRetryCount();

    let timeoutId: NodeJS.Timeout;
    let shortTimeoutId: NodeJS.Timeout;
    
    try {
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
      }, 8000);

      // Adicionar um pequeno atraso para garantir que o UI seja atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Determinar se estamos em um dispositivo móvel para ajustar as configurações
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      // Configurar constraints específicas para o dispositivo
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode,
          width: { ideal: isMobile ? 320 : 640 },
          height: { ideal: isMobile ? 240 : 480 }
        }
      };
      
      // Ajustes específicos para iOS
      if (isIOS) {
        constraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 320, max: 640 },
            height: { ideal: 240, max: 480 }
          }
        };
      }
      
      // Ajustes específicos para Android
      if (isAndroid) {
        constraints = {
          audio: false,
          video: {
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            facingMode
          }
        };
      }

      console.log("Inicializando câmera com configurações:", JSON.stringify(constraints));
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // Limpar timeouts se o stream foi obtido com sucesso
      clearTimeout(shortTimeoutId);
      clearTimeout(timeoutId);
      
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
  }, [isCameraActive, facingMode]);

  useEffect(() => {
    if (isCameraActive) {
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
