
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
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);
  const retryCountRef = useRef<number>(0);

  // Função para limpar qualquer stream anterior
  const cleanupStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.log("Error stopping individual track:", err);
          }
        });
      } catch (err) {
        console.log("Error stopping tracks:", err);
      }
      streamRef.current = null;
    }
    
    // Limpar o elemento de vídeo
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
        videoRef.current.load();
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
            setLastErrorMessage("MediaDevices API não é suportada");
          }
          return;
        }
        
        // Verificar dispositivos disponíveis
        const devices = await navigator.mediaDevices.enumerateDevices().catch(err => {
          console.error("Error enumerating devices:", err);
          return [];
        });
        
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          console.error("Nenhuma câmera detectada no dispositivo");
          if (mountedRef.current) {
            setHasCamera(false);
            setHasError(true);
            setIsLoading(false);
            setLastErrorMessage("Nenhuma câmera detectada");
          }
          return;
        }
        
        if (mountedRef.current) {
          setHasCamera(true);
        }
        
        // Tentar configurações simplificadas primeiro
        let constraints: MediaStreamConstraints = {
          audio: false,
          video: { facingMode }
        };
        
        console.log("Solicitando acesso à câmera com modo:", facingMode);
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (!mountedRef.current) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          
          streamRef.current = stream;
          retryCountRef.current = 0;
          
          if (videoRef.current && mountedRef.current) {
            try {
              videoRef.current.srcObject = stream;
              videoRef.current.playsInline = true;
              videoRef.current.muted = true;
              
              await videoRef.current.play();
              
              console.log("Câmera inicializada com sucesso");
              if (mountedRef.current) {
                setHasError(false);
                setIsLoading(false);
                setLastErrorMessage(null);
              }
            } catch (playError) {
              console.error("Erro ao iniciar vídeo:", playError);
              throw new Error(`Falha ao iniciar reprodução de vídeo: ${playError}`);
            }
          }
        } catch (mediaError: any) {
          // Tentar configuração alternativa se falhar
          console.error("Falha com configuração simples:", mediaError);
          
          try {
            // Tentar com configuração mais específica
            constraints = {
              audio: false,
              video: {
                facingMode,
                width: { ideal: 640 },
                height: { ideal: 480 }
              }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (!mountedRef.current) {
              stream.getTracks().forEach(track => track.stop());
              return;
            }
            
            streamRef.current = stream;
            retryCountRef.current = 0;
            
            if (videoRef.current && mountedRef.current) {
              try {
                videoRef.current.srcObject = stream;
                videoRef.current.playsInline = true;
                videoRef.current.muted = true;
                
                await videoRef.current.play();
                
                console.log("Câmera inicializada com sucesso (configuração alternativa)");
                if (mountedRef.current) {
                  setHasError(false);
                  setIsLoading(false);
                  setLastErrorMessage(null);
                }
              } catch (playError) {
                throw new Error(`Falha ao iniciar reprodução de vídeo: ${playError}`);
              }
            }
          } catch (finalError: any) {
            // Se ainda falhar, verificar se devemos tentar trocar a câmera
            if (retryCountRef.current < 1 && mountedRef.current) {
              retryCountRef.current++;
              console.log(`Tentando alternar para câmera ${facingMode === 'user' ? 'externa' : 'frontal'}`);
              
              // Tentar alternar automaticamente para o outro tipo de câmera
              setFacingMode(current => current === "user" ? "environment" : "user");
              return;
            }
            
            throw finalError;
          }
        }
      } catch (err: any) {
        console.error("Erro ao acessar câmera:", err);
        
        if (mountedRef.current) {
          setHasError(true);
          
          // Fornecer mensagem de erro mais específica
          let errorMessage = "Erro desconhecido ao acessar câmera";
          
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = "Permissão para acessar câmera negada";
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = "Nenhuma câmera detectada no dispositivo";
            setHasCamera(false);
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage = "Câmera está sendo usada por outro aplicativo";
          } else if (err.message) {
            errorMessage = `Erro: ${err.message}`;
          }
          
          setLastErrorMessage(errorMessage);
          toast.error(errorMessage);
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
    isLoading,
    lastErrorMessage
  };
};
