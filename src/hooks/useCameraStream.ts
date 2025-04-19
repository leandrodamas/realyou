
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
    let shortTimeoutId: NodeJS.Timeout;
    
    const startCamera = async () => {
      if (!isCameraActive) {
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);
      setIsVideoReady(false);

      // Shorter timeout to set video ready if taking too long
      shortTimeoutId = setTimeout(() => {
        if (mountedRef.current && isLoading) {
          console.log("First camera initialization timeout - setting video ready");
          setIsVideoReady(true);
        }
      }, 3000); // Reduced from 5 seconds to 3 seconds

      // Longer timeout to complete initialization if still loading
      timeoutId = setTimeout(() => {
        if (mountedRef.current && isLoading) {
          console.log("Final camera initialization timeout - forcing ready state");
          setIsLoading(false);
          setIsVideoReady(true);
        }
      }, 6000); // Reduced from 10 seconds to 6 seconds

      try {
        // Try with simpler constraints first
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode,
            width: { ideal: 640 }, // Reduced from 1280
            height: { ideal: 480 }  // Reduced from 720
          }
        };

        console.log("Initializing camera with constraints:", JSON.stringify(constraints));
        const stream = await initializeVideoStream(constraints, videoRef, mountedRef);
        
        if (stream && videoRef.current && mountedRef.current) {
          console.log("Camera stream obtained successfully");
          streamRef.current = stream;
          setupVideoElement(videoRef.current, stream);
          
          // Check immediately if video is playing
          ensureVideoPlaying(videoRef.current);
          
          // Force video ready after a brief delay regardless of waitForVideoReady
          setTimeout(() => {
            if (mountedRef.current && isLoading) {
              console.log("Forcing video ready state after delay");
              setIsVideoReady(true);
              setIsLoading(false);
            }
          }, 1500);
          
          try {
            await waitForVideoReady(videoRef.current);
            
            if (mountedRef.current) {
              // Check again if video is playing
              ensureVideoPlaying(videoRef.current);
              
              setIsVideoReady(true);
              setIsLoading(false);
              
              console.log("Video ready, dimensions:", 
                videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
            }
          } catch (readyError) {
            console.error("Video ready timeout:", readyError);
            // Even if timeout, we still set video ready to allow UI to progress
            if (mountedRef.current) {
              setIsVideoReady(true);
              setIsLoading(false);
            }
          }
        }
      } catch (error: any) {
        console.error("Camera access error:", error);
        if (mountedRef.current) {
          setHasError(true);
          
          // Define a more specific error message based on the error
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
      if (shortTimeoutId) clearTimeout(shortTimeoutId);
    };
  }, [isCameraActive, facingMode]);

  // Check video status more frequently
  useEffect(() => {
    if (!isCameraActive || !videoRef.current || hasError) return;

    // Check more frequently if video is functioning (every 1 second instead of 2)
    const checkInterval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.paused && video.srcObject) {
        console.log("Video is paused but should be playing, attempting to restart");
        ensureVideoPlaying(video);
      }
      
      // Log video status for debugging
      if (video) {
        console.log("Video status:", {
          readyState: video.readyState,
          paused: video.paused, 
          width: video.videoWidth,
          height: video.videoHeight
        });
      }
    }, 1000);

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
