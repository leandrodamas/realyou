
import { useEffect } from "react";
import { useCameraState } from "./camera/useCameraState";
import { 
  initializeVideoStream, 
  setupVideoElement, 
  waitForVideoReady, 
  ensureVideoPlaying 
} from "./camera/utils/cameraOperations";
import { useFaceDetection } from "./face-detection/useFaceDetection";
import type { CameraStreamState } from "./camera/types";

export const useCameraStream = (isCameraActive: boolean = true): CameraStreamState => {
  const {
    videoRef,
    streamRef,
    mountedRef,
    isLoading,
    setIsLoading,
    hasCamera,
    setHasCamera,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    facingMode,
    setFacingMode,
    isVideoReady,
    setIsVideoReady
  } = useCameraState(isCameraActive);

  const { faceDetected } = useFaceDetection({
    isCameraActive,
    isInitializing: false,
    isLoading,
    videoRef,
    isVideoReady
  });

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
        console.log(`Found ${videoDevices.length} cameras:`, videoDevices.map(d => d.label || "unnamed camera"));
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startCamera = async () => {
      if (!isCameraActive) {
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      setIsVideoReady(false);

      // Definir um timeout mais longo para garantir que os usuários não fiquem presos no estado de carregamento
      timeoutId = setTimeout(() => {
        if (mountedRef.current && isLoading) {
          console.log("Camera initialization timeout - forcing ready state");
          setIsLoading(false);
          setIsVideoReady(true);
        }
      }, 15000);

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
        
        if (stream && videoRef.current && mountedRef.current) {
          streamRef.current = stream;
          setupVideoElement(videoRef.current, stream);
          
          // Verifica imediatamente se o vídeo está tocando
          ensureVideoPlaying(videoRef.current);
          
          await waitForVideoReady(videoRef.current);
          
          if (mountedRef.current) {
            // Verificar novamente se o vídeo está tocando
            ensureVideoPlaying(videoRef.current);
            
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Camera access error:", error);
        if (mountedRef.current) {
          setHasError(true);
          
          // Definir uma mensagem de erro mais específica com base no erro
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setErrorMessage("Permissão para acessar câmera foi negada. Por favor, verifique as configurações do seu navegador.");
          } else if (error.name === 'NotFoundError') {
            setErrorMessage("Nenhuma câmera encontrada no dispositivo.");
          } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            setErrorMessage("Não foi possível acessar a câmera. Ela pode estar sendo usada por outro aplicativo.");
          } else if (error.message && error.message.includes('timeout')) {
            setErrorMessage("Tempo esgotado ao tentar acessar a câmera. Por favor, tente novamente.");
          } else {
            setErrorMessage(`Erro ao acessar câmera: ${error.message || 'Erro desconhecido'}`);
          }
          
          setIsLoading(false);
        }
      }
    };

    startCamera();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isCameraActive, facingMode]);

  // Adicionar um efeito para verificar periodicamente o status do vídeo
  useEffect(() => {
    if (!isCameraActive || !videoRef.current || hasError) return;

    // Verificar a cada 2 segundos se o vídeo está realmente funcionando
    const checkInterval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.paused && video.srcObject) {
        console.log("Video is paused but should be playing, attempting to restart");
        ensureVideoPlaying(video);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [isCameraActive, hasError]);

  const switchCamera = () => {
    if (!isLoading) {
      setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
    }
  };

  return {
    videoRef,
    hasError,
    switchCamera,
    facingMode,
    hasCamera,
    isLoading,
    errorMessage,
    lastErrorMessage: errorMessage,
    isVideoReady,
    faceDetected
  };
};
