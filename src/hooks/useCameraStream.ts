
import { useState, useEffect } from "react";
import { useCameraAccess } from "./camera/useCameraAccess";
import { useDeviceDetection } from "./camera/useDeviceDetection";
import { useCameraError } from "./camera/useCameraError";
import { cleanupCameraStream } from "./utils/cameraUtils";
import { CameraStreamState } from "./camera/types";

export const useCameraStream = (isCameraActive: boolean): CameraStreamState => {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const { videoRef, streamRef, isLoading, setIsLoading, isVideoReady, initializeCamera, mountedRef } = useCameraAccess(isCameraActive, facingMode);
  const { hasCamera, checkCameraAvailability } = useDeviceDetection();
  const { hasError, lastErrorMessage, retryCountRef, handleCameraError, resetError } = useCameraError();

  useEffect(() => {
    let setupTimeout: ReturnType<typeof setTimeout>;
    
    const setupCamera = async () => {
      // Check if component is unmounted or camera should not be active
      if (!isCameraActive) {
        cleanupCameraStream(streamRef.current, videoRef.current);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const hasCameraAvailable = await checkCameraAvailability();
        if (!hasCameraAvailable) {
          throw new Error("No camera available");
        }
        
        let constraints: MediaStreamConstraints = {
          audio: false,
          video: { 
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        console.log("Solicitando acesso à câmera com modo:", facingMode);
        
        try {
          await initializeCamera(constraints);
          // Check if component is still mounted before updating state
          if (mountedRef.current) {
            resetError();
            setIsLoading(false);
          }
        } catch (mediaError) {
          if (retryCountRef.current < 1 && mountedRef.current) {
            retryCountRef.current++;
            setFacingMode(current => current === "user" ? "environment" : "user");
            return;
          }
          throw mediaError;
        }
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        if (mountedRef.current) {
          handleCameraError(err);
          setIsLoading(false);
        }
      }
    };

    setupCamera();
    
    return () => {
      if (setupTimeout) clearTimeout(setupTimeout);
      cleanupCameraStream(streamRef.current, videoRef.current);
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
    lastErrorMessage,
    isVideoReady
  };
};
