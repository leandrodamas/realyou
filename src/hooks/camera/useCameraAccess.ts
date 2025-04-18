
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
        const video = videoRef.current;
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        video.autoplay = true;
        
        try {
          // Set an explicit width and height on the video element
          video.width = 640;
          video.height = 480;
          
          // Explicitly force play
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Video playback started successfully");
              
              // Wait for video metadata to load
              if (video.readyState === 0) {
                console.log("Video readyState is 0, waiting for metadata...");
                video.addEventListener("loadedmetadata", () => {
                  console.log("Video metadata loaded");
                  waitForVideoReady(video).then(ready => {
                    if (ready && mountedRef.current) {
                      setIsVideoReady(true);
                    }
                  });
                });
              } else {
                waitForVideoReady(video).then(ready => {
                  if (ready && mountedRef.current) {
                    setIsVideoReady(true);
                  }
                });
              }
            }).catch(err => {
              console.error("Error during video playback:", err);
              toast.error("Erro ao iniciar a câmera. Tente novamente.");
            });
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
