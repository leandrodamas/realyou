
import { useCallback } from "react";
import { initializeVideoStream } from "./utils/streamInitializer";
import { setupVideoElement } from "./utils/videoElementSetup";
import { toast } from "sonner";

/**
 * Hook that provides camera startup functionality
 */
export const useStartCamera = (
  isCameraActive: boolean,
  facingMode: "user" | "environment",
  videoRef: React.RefObject<HTMLVideoElement>,
  streamRef: React.MutableRefObject<MediaStream | null>,
  mountedRef: React.RefObject<boolean>,
  setIsLoading: (isLoading: boolean) => void,
  setIsVideoReady: (isReady: boolean) => void,
  resetError: () => void,
  handleCameraError: (error: any) => void,
  incrementRetryCount: () => void,
  resetRetryCount: () => void
) => {
  const startCamera = useCallback(async () => {
    if (!isCameraActive) return;
    
    console.log("useStartCamera: Iniciando câmera com facingMode:", facingMode);
    setIsLoading(true);
    setIsVideoReady(false);
    resetError();

    // Reset retry counter when trying new camera access
    resetRetryCount();

    let timeoutId: NodeJS.Timeout;
    
    try {
      console.log("useStartCamera: Tentando iniciar a câmera...");
      
      // Set a timeout for camera initialization
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("useStartCamera: Timeout de inicialização da câmera - forçando estado de pronto");
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
      
      console.log("useStartCamera: Detectado dispositivo:", 
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
      
      console.log("useStartCamera: Tentativa de inicialização da câmera com configurações:", 
                  JSON.stringify(constraints));
      
      // Force a small delay before initializing camera
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Solicitar permissão explicitamente primeiro (usamos uma requisição mais simples)
      try {
        await navigator.mediaDevices.getUserMedia({video: true});
        console.log("useStartCamera: Permissão de câmera concedida");
      } catch (permErr) {
        console.error("useStartCamera: Erro na permissão inicial:", permErr);
        // Continue mesmo com erro aqui, vamos tentar novamente com configurações específicas
      }
      
      // Tenta inicializar o stream com as configurações específicas
      const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
      
      // Se chegou aqui, tivemos sucesso
      clearTimeout(timeoutId);
      
      if (stream && videoRef.current && mountedRef.current) {
        console.log("useStartCamera: Stream da câmera obtido com sucesso");
        streamRef.current = stream;
        
        // Configurar o elemento de vídeo com o stream
        setupVideoElement(videoRef.current, stream);
        
        // Para iOS, adicionar um pequeno atraso adicional
        const setupDelay = isIOS ? 800 : 500;
        
        // Adicionar um pequeno atraso antes de atualizar o estado
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("useStartCamera: Configurando vídeo como pronto");
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }, setupDelay);
        
        return;
      }
    } catch (error: any) {
      console.error("useStartCamera: Erro de acesso à câmera:", error);
      
      // Limpar timeout se ocorrer erro
      clearTimeout(timeoutId);
      
      if (mountedRef.current) {
        incrementRetryCount();
        handleCameraError(error);
        
        // Tentar iniciar com facingMode alternativo se não funcionou
        if (!hasRetried.current) {
          console.log("useStartCamera: Tentando com facingMode alternativo");
          // Esta lógica está apenas para logging, a mudança real de facingMode é controlada externamente
          toast.info("Tentando com câmera frontal...", { duration: 3000 });
          hasRetried.current = true;
        }
        
        setIsLoading(false);
      }
    }
  }, [isCameraActive, facingMode, handleCameraError, incrementRetryCount, 
      resetError, resetRetryCount, setIsLoading, setIsVideoReady]);

  // Track retries in the current render cycle
  const hasRetried = useCallback(() => {
    const ref = { current: false };
    return ref;
  }, [])();

  return { startCamera };
};
