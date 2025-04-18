
import { useRef, useState, useEffect } from "react";
import { cleanupCameraStream } from "../utils/cameraUtils";
import { toast } from "sonner";
import { CameraAccessState } from "./types";

export const useCameraAccess = (isCameraActive: boolean, facingMode: "user" | "environment"): CameraAccessState => {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Instead of trying to modify mountedRef.current directly in the cleanup function,
    // we'll just use it as a flag for checking component mounted state
    return () => {
      cleanupCameraStream(streamRef.current, videoRef.current);
    };
  }, []);

  const waitForVideoReady = (video: HTMLVideoElement) => {
    return new Promise<boolean>((resolve) => {
      const checkReady = () => {
        if (video.readyState >= 2) {
          console.log("Video is ready with dimensions:", video.videoWidth, "x", video.videoHeight);
          resolve(true);
        } else {
          console.log("Video not ready yet, current readyState:", video.readyState);
          setTimeout(checkReady, 100);
        }
      };

      video.addEventListener('loadeddata', () => {
        console.log("Video loadeddata event fired");
        checkReady();
      });

      // Também verificamos imediatamente
      checkReady();
    });
  };

  const initializeCamera = async (constraints: MediaStreamConstraints) => {
    try {
      console.log("Initializing camera with constraints:", constraints);
      
      if (streamRef.current) {
        console.log("Cleaning up existing stream before requesting new one");
        cleanupCameraStream(streamRef.current, videoRef.current);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained successfully");
      
      if (!mountedRef.current) {
        console.log("Component unmounted, cleaning up stream");
        stream.getTracks().forEach(track => track.stop());
        return null;
      }
      
      streamRef.current = stream;
      
      if (videoRef.current && mountedRef.current) {
        console.log("Setting video source and playing");
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        
        try {
          // Tocar o vídeo e aguardar pelo menos 500ms para garantir que o navegador tenha tempo de inicializar
          await videoRef.current.play();
          console.log("Video playback started successfully");
          
          // Aguardar até que o vídeo esteja pronto para uso
          if (await waitForVideoReady(videoRef.current)) {
            setIsVideoReady(true);
          }
        } catch (playError) {
          console.error("Error during video playback:", playError);
          toast.error("Erro ao iniciar a câmera. Tente novamente.");
          throw playError;
        }
      }
      
      return stream;
    } catch (error) {
      console.error("Error in initializeCamera:", error);
      throw error;
    }
  };

  return {
    videoRef,
    streamRef,
    isLoading,
    setIsLoading,
    isVideoReady,
    initializeCamera,
    mountedRef
  };
};
