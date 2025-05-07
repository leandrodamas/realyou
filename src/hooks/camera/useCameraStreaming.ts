
import { useEffect, useCallback } from "react";
import { useCameraState } from "./useCameraState";
import { initializeVideoStream } from "./utils/streamInitializer";
import { setupVideoElement } from "./utils/videoElementSetup";
import { toast } from "sonner";

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
    resetRetryCount,
    incrementRetryCount,
    hasReachedMaxRetries,
    resetError
  } = useCameraState(isCameraActive);

  const startCamera = useCallback(async () => {
    if (!isCameraActive) return;
    
    console.log("useCameraStreaming: Iniciando câmera com facingMode:", facingMode);
    setIsLoading(true);
    setIsVideoReady(false);
    resetError();

    // Reset retry counter when trying new camera access
    resetRetryCount();

    let timeoutId: NodeJS.Timeout;
    
    try {
      console.log("useCameraStreaming: Tentando iniciar a câmera...");
      
      // Set a timeout for camera initialization
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("useCameraStreaming: Timeout de inicialização da câmera - forçando estado de pronto");
          setIsLoading(false);
          setIsVideoReady(true);
          
          // Em alguns navegadores, podemos tentar forçar interação do usuário para ativar a câmera
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (isIOS) {
            toast.info("Toque na tela para ativar a câmera", { duration: 3000 });
          }
        }
      }, 8000); // 8 segundos para timeout

      // Determinar se estamos em um dispositivo móvel para ajustar as configurações
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      console.log("useCameraStreaming: Detectado dispositivo:", 
                  isMobile ? (isIOS ? "iOS" : "Android") : "Desktop");
      
      // Configurações adaptadas para plataforma
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: { facingMode }
      };
      
      if (typeof navigator.mediaDevices === 'undefined' || 
          typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        throw new Error("API de mídia não disponível neste navegador");
      }
      
      console.log("useCameraStreaming: Tentativa de inicialização da câmera com configurações:", 
                  JSON.stringify(constraints));
      
      // Force a small delay before initializing camera
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Solicitar permissão explicitamente primeiro (usamos uma requisição mais simples)
      try {
        await navigator.mediaDevices.getUserMedia({video: true});
        console.log("useCameraStreaming: Permissão de câmera concedida");
      } catch (permErr) {
        console.error("useCameraStreaming: Erro na permissão inicial:", permErr);
        // Continue mesmo com erro aqui, vamos tentar novamente com configurações específicas
      }
      
      // Tenta inicializar o stream com as configurações específicas
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // Se chegou aqui, tivemos sucesso
      clearTimeout(timeoutId);
      
      if (stream && videoRef.current && mountedRef.current) {
        console.log("useCameraStreaming: Stream da câmera obtido com sucesso");
        streamRef.current = stream;
        
        // Configurar o elemento de vídeo com o stream
        setupVideoElement(videoRef.current, stream);
        
        // Para iOS, adicionar um pequeno atraso adicional
        const setupDelay = isIOS ? 800 : 500;
        
        // Adicionar um pequeno atraso antes de atualizar o estado
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("useCameraStreaming: Configurando vídeo como pronto");
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }, setupDelay);
        
        return;
      }
    } catch (error: any) {
      console.error("useCameraStreaming: Erro de acesso à câmera:", error);
      
      // Limpar timeout se ocorrer erro
      clearTimeout(timeoutId);
      
      if (mountedRef.current) {
        incrementRetryCount();
        handleCameraError(error);
        
        // Tentar iniciar com facingMode alternativo se não funcionou
        if (retryCountRef.current === 1) {
          console.log("useCameraStreaming: Tentando com facingMode alternativo");
          // Esta lógica está apenas para logging, a mudança real de facingMode é controlada externamente
          toast.info("Tentando com câmera frontal...", { duration: 3000 });
        }
        
        setIsLoading(false);
      }
    }
  }, [isCameraActive, facingMode, handleCameraError, incrementRetryCount, 
      resetError, resetRetryCount, setIsLoading, setIsVideoReady]);

  useEffect(() => {
    if (isCameraActive) {
      console.log("useCameraStreaming: Câmera ativada, iniciando...");
      startCamera();
    } else {
      console.log("useCameraStreaming: Câmera desativada");
    }
    
    // Cleanup function to stop camera when component unmounts or camera is deactivated
    return () => {
      if (streamRef.current) {
        console.log("useCameraStreaming: Limpando stream da câmera");
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
            console.log("useCameraStreaming: Trilha parada:", track.kind);
          } catch (e) {
            console.error("useCameraStreaming: Erro ao parar trilha:", e);
          }
        });
      }
      
      if (videoRef.current) {
        try {
          videoRef.current.srcObject = null;
        } catch (e) {
          console.error("useCameraStreaming: Erro ao limpar srcObject:", e);
        }
      }
    };
  }, [isCameraActive, facingMode, startCamera]);
  
  // Iniciar a câmera novamente se não iniciar corretamente na primeira vez
  useEffect(() => {
    if (!isCameraActive || hasReachedMaxRetries()) return;
    
    const checkVideoTimeout = setTimeout(() => {
      const video = videoRef.current;
      if (video && (!video.srcObject || video.videoWidth === 0) && mountedRef.current) {
        console.log("useCameraStreaming: Câmera não inicializou, tentando reiniciar");
        startCamera();
      }
    }, 2500);
    
    return () => clearTimeout(checkVideoTimeout);
  }, [isCameraActive, hasReachedMaxRetries, startCamera]);

  return;
};
