
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
    incrementRetryCount
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
      // Set a timeout for camera initialization
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Timeout de inicialização da câmera - forçando estado de pronto");
          setIsLoading(false);
          setIsVideoReady(true);
          
          // Em alguns navegadores, podemos tentar forçar interação do usuário para ativar a câmera
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (isIOS) {
            toast.info("Toque na tela para ativar a câmera", { duration: 3000 });
          }
        }
      }, 10000); // 10 segundos para timeout

      // Determinar se estamos em um dispositivo móvel para ajustar as configurações
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      // Configurações adaptadas para plataforma
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode
        }
      };
      
      // Add resolution constraints based on device
      if (isMobile) {
        if (isIOS) {
          (constraints.video as MediaTrackConstraints).width = { ideal: 640, max: 1280 };
          (constraints.video as MediaTrackConstraints).height = { ideal: 480, max: 720 };
        } else {
          // Android
          (constraints.video as MediaTrackConstraints).width = { ideal: 640 };
          (constraints.video as MediaTrackConstraints).height = { ideal: 480 };
        }
      } else {
        // Desktop
        (constraints.video as MediaTrackConstraints).width = { ideal: 1280 };
        (constraints.video as MediaTrackConstraints).height = { ideal: 720 };
      }

      console.log("Tentativa de inicialização da câmera com configurações:", JSON.stringify(constraints));
      
      // Force a small delay before initializing camera
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Tentar inicializar stream com configurações específicas
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // Se chegou aqui, tivemos sucesso
      clearTimeout(timeoutId);
      
      if (stream && videoRef.current && mountedRef.current) {
        console.log("Stream da câmera obtido com sucesso");
        streamRef.current = stream;
        
        // Configurar o elemento de vídeo com o stream
        setupVideoElement(videoRef.current, stream);
        
        // Para iOS, adicionar um pequeno atraso adicional
        const setupDelay = isIOS ? 800 : 500;
        
        // Adicionar um pequeno atraso antes de atualizar o estado
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("Configurando video como pronto");
            setIsVideoReady(true);
            setIsLoading(false);
            
            // Forçar refresh da interface
            if (videoRef.current) {
              try {
                const event = new Event('resize');
                window.dispatchEvent(event);
              } catch (e) {
                console.error("Erro ao disparar evento:", e);
              }
            }
          }
        }, setupDelay);
      }
    } catch (error: any) {
      console.error("Erro de acesso à câmera:", error);
      
      // Limpar timeout se ocorrer erro
      clearTimeout(timeoutId);
      
      if (mountedRef.current) {
        incrementRetryCount();
        handleCameraError(error);
        setIsLoading(false);
        
        // Se for dispositivo móvel, dar dicas específicas ao usuário
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          toast.error("Erro ao acessar câmera. Verifique as permissões.", {
            duration: 5000,
            id: "camera-error-mobile"
          });
        }
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
  
  // Adicionar um efeito para tentar reiniciar a câmera se ela não iniciar
  useEffect(() => {
    if (isCameraActive) {
      // Verificar se a câmera inicializou corretamente após algum tempo
      const checkCameraTimeout = setTimeout(() => {
        const video = videoRef.current;
        if (video && (!video.srcObject || video.readyState === 0) && mountedRef.current) {
          console.log("Câmera não inicializada corretamente, tentando reiniciar");
          startCamera();
        }
      }, 5000);
      
      // Uma segunda verificação após mais tempo
      const secondCheckTimeout = setTimeout(() => {
        const video = videoRef.current;
        if (video && (!video.videoWidth || !video.videoHeight) && mountedRef.current) {
          console.log("Câmera iniciada, mas sem dimensões de vídeo. Tentando novamente.");
          startCamera();
        }
      }, 8000);
      
      return () => {
        clearTimeout(checkCameraTimeout);
        clearTimeout(secondCheckTimeout);
      };
    }
  }, [isCameraActive, startCamera]);

  return;
};
