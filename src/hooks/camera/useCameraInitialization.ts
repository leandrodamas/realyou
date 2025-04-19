
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";

export const useCameraInitialization = (isCameraActive: boolean) => {
  const {
    videoRef,
    setHasCamera,
    setIsLoading,
    handleCameraError,
    setIsVideoReady,
    mountedRef
  } = useCameraState(isCameraActive);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        console.log("Verificando disponibilidade de câmeras...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const hasCamera = videoDevices.length > 0;
        
        console.log(`Encontradas ${videoDevices.length} câmeras:`, videoDevices.map(d => d.label || "câmera sem nome"));
        setHasCamera(hasCamera);
        
        if (!hasCamera) {
          console.error("Nenhuma câmera detectada no dispositivo");
          handleCameraError({
            name: "NoCameraError",
            message: "Nenhuma câmera detectada neste dispositivo"
          });
        }
      } catch (error) {
        console.error("Erro ao verificar câmera:", error);
        setHasCamera(false);
        handleCameraError({
          name: "DeviceEnumerationError", 
          message: "Não foi possível acessar as câmeras do dispositivo"
        });
      }
    };
    
    if (isCameraActive) {
      checkCamera();
    }
  }, [isCameraActive, setHasCamera, handleCameraError]);

  return { videoRef, mountedRef };
};
