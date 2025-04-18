
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCameraStream = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Função para limpar qualquer stream anterior
  const cleanupStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log("Error stopping tracks:", err);
      }
      streamRef.current = null;
    }
    
    // Limpar o elemento de vídeo
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch (err) {
        console.log("Error clearing video srcObject:", err);
      }
    }
  };

  useEffect(() => {
    // Set mounted flag
    mountedRef.current = true;
    
    return () => {
      // Clean flag on unmount
      mountedRef.current = false;
      cleanupStream();
    };
  }, []);

  useEffect(() => {
    let setupTimeout: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    const maxRetries = 3;

    const setupCamera = async () => {
      // Não prosseguir se o componente foi desmontado
      if (!mountedRef.current) return;
      
      if (!isCameraActive) {
        cleanupStream();
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Limpar qualquer stream anterior
        cleanupStream();
        
        // Verificar se o MediaDevices é suportado
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("MediaDevices API não é suportada neste navegador");
          if (mountedRef.current) {
            toast.error("Seu dispositivo não suporta acesso à câmera");
            setHasError(true);
            setIsLoading(false);
          }
          return;
        }
        
        // Verificar dispositivos disponíveis
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          console.error("Nenhuma câmera detectada no dispositivo");
          if (mountedRef.current) {
            setHasCamera(false);
            setHasError(true);
            setIsLoading(false);
          }
          return;
        }
        
        if (mountedRef.current) {
          setHasCamera(true);
        }
        
        // Configurações simplificadas sem propriedades avançadas problemáticas
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };
        
        console.log("Solicitando acesso à câmera com modo:", facingMode);
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Verificar se o componente ainda está montado
        if (!mountedRef.current) {
          // Limpar o stream se o componente foi desmontado
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = stream;
        
        if (videoRef.current && mountedRef.current) {
          try {
            videoRef.current.srcObject = stream;
            
            // Garantir que o vídeo seja reproduzido com baixa latência
            videoRef.current.playsInline = true;
            videoRef.current.muted = true;

            // Usar timeout para garantir que o stream esteja pronto
            await new Promise<void>((resolve, reject) => {
              const playTimeout = setTimeout(() => {
                reject(new Error("Tempo limite ao iniciar vídeo"));
              }, 5000);
              
              const playHandler = () => {
                clearTimeout(playTimeout);
                videoRef.current?.removeEventListener("playing", playHandler);
                resolve();
              };
              
              videoRef.current.addEventListener("playing", playHandler);
              
              videoRef.current.play().catch(error => {
                clearTimeout(playTimeout);
                videoRef.current?.removeEventListener("playing", playHandler);
                reject(error);
              });
            });
            
            console.log("Câmera inicializada com sucesso");
            if (mountedRef.current) {
              setHasError(false);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Erro ao iniciar vídeo:", error);
            throw new Error(`Falha ao iniciar reprodução de vídeo: ${error}`);
          }
        }
      } catch (err: any) {
        console.error("Erro ao acessar câmera:", err);
        
        if (retryCount < maxRetries && mountedRef.current) {
          retryCount++;
          console.log(`Tentativa ${retryCount} de ${maxRetries} para acessar a câmera`);
          
          // Esperar antes de tentar novamente
          setupTimeout = setTimeout(() => {
            if (mountedRef.current) {
              setupCamera();
            }
          }, 1000);
          return;
        }
        
        if (mountedRef.current) {
          setHasError(true);
          
          // Fornecer mensagem de erro mais específica
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            toast.error("Permissão para acessar câmera negada");
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            toast.error("Nenhuma câmera detectada no dispositivo");
            setHasCamera(false);
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            toast.error("Câmera está sendo usada por outro aplicativo");
          } else {
            toast.error(`Erro ao acessar câmera: ${err.message || "Erro desconhecido"}`);
          }
          
          setIsLoading(false);
        }
      }
    };

    // Iniciar a configuração da câmera
    setupCamera();

    return () => {
      cleanupStream();
      if (setupTimeout) clearTimeout(setupTimeout);
    };
  }, [isCameraActive, facingMode]);

  const switchCamera = () => {
    if (!isLoading) {
      setFacingMode(current => current === "user" ? "environment" : "user");
    }
  };

  return { 
    videoRef, 
    hasError, 
    switchCamera, 
    facingMode, 
    hasCamera, 
    isLoading 
  };
};
