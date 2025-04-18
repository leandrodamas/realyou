
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCameraStream = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Função para limpar qualquer stream anterior
  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    let setupTimeout: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    const maxRetries = 3;

    const setupCamera = async () => {
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
          toast.error("Seu dispositivo não suporta acesso à câmera");
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        // Verificar dispositivos disponíveis
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          console.error("Nenhuma câmera detectada no dispositivo");
          setHasCamera(false);
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        setHasCamera(true);
        
        // Configurações otimizadas para mobile
        const constraints = {
          audio: false,
          video: {
            facingMode: facingMode,
            width: { ideal: 640 }, // Reduzido para melhor performance
            height: { ideal: 480 },
            frameRate: { ideal: 24 } // Limitar framerate para economizar recursos
          }
        };
        
        console.log("Solicitando acesso à câmera com modo:", facingMode);
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Garantir que o vídeo seja reproduzido com baixa latência
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          
          await videoRef.current.play().catch(error => {
            console.error("Erro ao reproduzir vídeo:", error);
            throw new Error(`Falha ao iniciar reprodução de vídeo: ${error.message}`);
          });
          
          console.log("Câmera inicializada com sucesso");
          setHasError(false);
        }
      } catch (err: any) {
        console.error("Erro ao acessar câmera:", err);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Tentativa ${retryCount} de ${maxRetries} para acessar a câmera`);
          
          // Esperar antes de tentar novamente
          setupTimeout = setTimeout(() => {
            setupCamera();
          }, 1000);
          return;
        }
        
        setHasError(true);
        
        // Fornecer mensagem de erro mais específica
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          toast.error("Permissão para acessar câmera negada");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          toast.error("Nenhuma câmera detectada no dispositivo");
          setHasCamera(false);
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          toast.error("Câmera pode estar sendo usada por outro aplicativo");
        } else {
          toast.error(`Erro ao acessar câmera: ${err.message || "Erro desconhecido"}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    setupCamera();

    return () => {
      cleanupStream();
      if (setupTimeout) clearTimeout(setupTimeout);
    };
  }, [isCameraActive, facingMode]);

  const switchCamera = () => {
    setFacingMode(current => current === "user" ? "environment" : "user");
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
