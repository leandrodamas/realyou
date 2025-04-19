
import { useEffect } from "react";
import { useCameraState } from "./useCameraState";
import { initializeVideoStream, setupVideoElement } from "./utils/cameraOperations";

export const useCameraStreaming = (isCameraActive: boolean) => {
  const {
    videoRef,
    streamRef,
    mountedRef,
    setIsLoading,
    handleCameraError,
    setIsVideoReady,
    facingMode
  } = useCameraState(isCameraActive);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let shortTimeoutId: NodeJS.Timeout;
    
    const startCamera = async () => {
      if (!isCameraActive) return;

      setIsLoading(true);
      setIsVideoReady(false);

      // Set a short timeout to ensure the UI shows loading state
      shortTimeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("First camera initialization timeout - setting video ready");
          setIsVideoReady(true);
        }
      }, 3000);

      // Set a longer timeout for final fallback
      timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Final camera initialization timeout - forcing ready state");
          setIsLoading(false);
          setIsVideoReady(true);
        }
      }, 6000);

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };

        console.log("Initializing camera with constraints:", JSON.stringify(constraints));
        const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
        
        if (stream && videoRef.current && mountedRef.current) {
          console.log("Camera stream obtained successfully");
          streamRef.current = stream;
          setupVideoElement(videoRef.current, stream);
          
          if (mountedRef.current) {
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Camera access error:", error);
        if (mountedRef.current) {
          handleCameraError(error);
          setIsLoading(false);
        }
      }
    };

    startCamera();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (shortTimeoutId) clearTimeout(shortTimeoutId);
    };
  }, [isCameraActive, facingMode]);
};
