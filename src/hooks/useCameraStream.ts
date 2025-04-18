
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
        
        // Configurações otimizadas para melhor exposição e brilho
        const constraints = {
          audio: false,
          video: {
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 24 },
            // Configurações de exposição/brilho - funcionam em alguns dispositivos
            advanced: [
              {
                exposureMode: "continuous",
                exposureCompensation: 1.5, // Aumentar exposição (se suportado)
                brightness: 1.5,           // Aumentar brilho (se suportado)
                contrast: 1.2,             // Aumentar contraste (se suportado)
                whiteBalanceMode: "continuous"
              }
            ]
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
          
          // Configurar tracks de vídeo para melhor exposição (se suportado)
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
            try {
              const capabilities = videoTrack.getCapabilities();
              const settings = videoTrack.getSettings();
              
              // Aplicar configurações de exposição se disponíveis
              if (capabilities.exposureMode && capabilities.exposureCompensation) {
                const constraints = {
                  exposureMode: "continuous", 
                  exposureCompensation: capabilities.exposureCompensation.max * 0.75 // 75% do máximo
                };
                await videoTrack.applyConstraints({ advanced: [constraints] });
              }
              
              // Tentar aplicar configurações de brilho para alguns dispositivos
              if (capabilities.brightness || capabilities.contrast) {
                await videoTrack.applyConstraints({
                  advanced: [{
                    brightness: capabilities.brightness ? capabilities.brightness.max * 0.7 : undefined,
                    contrast: capabilities.contrast ? capabilities.contrast.max * 0.65 : undefined
                  }]
                });
              }
            } catch (err) {
              console.log("Avançado: Não foi possível aplicar configurações avançadas de câmera", err);
              // Continuar mesmo se as configurações avançadas falharem
            }
          }
          
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
