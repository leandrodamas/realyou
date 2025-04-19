
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

  return { videoRef, mountedRef };
};
