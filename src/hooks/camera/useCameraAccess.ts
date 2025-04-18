
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
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
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

      // Listen for the loadeddata event explicitly
      video.addEventListener('loadeddata', () => {
        console.log("Video loadeddata event fired");
        checkReady();
      });
      
      // Also listen for the canplay event which might be more reliable
      video.addEventListener('canplay', () => {
        console.log("Video canplay event fired");
        checkReady();
      });

      // Also check immediately
      checkReady();
    });
  };

  const initializeCamera = async (constraints: MediaStreamConstraints) => {
    try {
      console.log("Initializing camera with constraints:", JSON.stringify(constraints));
      
      if (streamRef.current) {
        console.log("Cleaning up existing stream before requesting new one");
        cleanupCameraStream(streamRef.current, videoRef.current);
      }
      
      // Force user to grant permission via a noticeable UI indicator
      setIsLoading(true);
      
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
        const video = videoRef.current;
        
        // Make sure any previous stream is properly disconnected
        if (video.srcObject) {
          video.srcObject = null;
          video.load();
        }
        
        // Set new stream and configure video element
        video.srcObject = stream;
        video.playsInline = true; 
        video.muted = true;
        video.autoplay = true;
        
        try {
          // Set explicit dimensions to help rendering
          video.width = 640;
          video.height = 480;
          
          console.log("Attempting to play video");
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log("Video playback started successfully");
            
            // Check if video is already ready
            if (video.readyState >= 2) {
              console.log("Video is immediately ready");
              setIsVideoReady(true);
            } else {
              console.log("Waiting for video to be ready, current readyState:", video.readyState);
              
              // Set up a timeout to prevent infinite waiting
              const readyTimeout = setTimeout(() => {
                console.log("Video ready timeout - forcing ready state");
                if (mountedRef.current) {
                  setIsVideoReady(true);
                }
              }, 3000);
              
              // Wait for video to be ready
              const isReady = await waitForVideoReady(video);
              clearTimeout(readyTimeout);
              
              if (isReady && mountedRef.current) {
                console.log("Video is now ready after waiting");
                setIsVideoReady(true);
              }
            }
          } else {
            console.log("Play promise was undefined, setting video ready");
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
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
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
