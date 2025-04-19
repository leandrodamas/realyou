
import { useEffect } from "react";
import { useCameraState } from "./camera/useCameraState";
import { initializeVideoStream, setupVideoElement, waitForVideoReady } from "./camera/utils/cameraOperations";
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
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (!isCameraActive) {
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      setIsVideoReady(false);

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
          await waitForVideoReady(videoRef.current);
          if (mountedRef.current) {
            setIsVideoReady(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Camera access error:", error);
        if (mountedRef.current) {
          setHasError(true);
          setErrorMessage("Erro ao acessar câmera. Verifique as permissões.");
          setIsLoading(false);
        }
      }
    };

    startCamera();
  }, [isCameraActive, facingMode]);

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
