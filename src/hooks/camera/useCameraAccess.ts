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
      // Maximum wait time for video readiness (3 seconds)
      const maxWaitTime = 3000; 
      const startTime = Date.now();
      
      // If video already has dimensions, it's ready
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        console.log("Video already has dimensions:", video.videoWidth, "x", video.videoHeight);
        resolve(true);
        return;
      }
      
      // Function to check if video is ready
      const checkReady = () => {
        // If video has dimensions, it's ready
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          console.log("Video has dimensions now:", video.videoWidth, "x", video.videoHeight);
          resolve(true);
          return;
        }
        
        // If video readyState is at least HAVE_CURRENT_DATA (2), it's ready
        if (video.readyState >= 2) {
          console.log("Video is ready with readyState:", video.readyState);
          resolve(true);
          return;
        }
        
        // Check if we've exceeded maximum wait time
        if (Date.now() - startTime > maxWaitTime) {
          console.log("Video ready timeout exceeded, forcing ready state");
          resolve(true);
          return;
        }
        
        // Otherwise, check again in a moment
        console.log("Video not ready yet, current readyState:", video.readyState);
        setTimeout(checkReady, 100);
      };

      // Set up event listeners for video readiness
      const handleVideoReady = () => {
        console.log("Video ready event fired");
        resolve(true);
      };
      
      video.addEventListener('loadeddata', handleVideoReady, { once: true });
      video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
      video.addEventListener('canplay', handleVideoReady, { once: true });
      
      // Also start the polling check
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
          video.style.width = "100%";
          video.style.height = "100%";
          
          console.log("Attempting to play video");
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Video playback started successfully");
              
              // Set a timeout to force video ready state after 3 seconds
              const forceReadyTimeout = setTimeout(() => {
                if (mountedRef.current && !isVideoReady) {
                  console.log("Forcing video ready state after timeout");
                  setIsVideoReady(true);
                }
              }, 3000);
              
              // Check if video is already ready
              waitForVideoReady(video).then(() => {
                clearTimeout(forceReadyTimeout);
                if (mountedRef.current) {
                  console.log("Video is ready to display");
                  setIsVideoReady(true);
                }
              });
            }).catch(error => {
              console.error("Error during video play:", error);
              
              // Even if play fails, we should try to set video as ready
              if (mountedRef.current) {
                console.log("Setting video ready despite play error");
                setIsVideoReady(true);
              }
            });
          } else {
            console.log("Play promise was undefined, setting video ready");
            setIsVideoReady(true);
          }
        } catch (playError) {
          console.error("Error during video playback setup:", playError);
          if (mountedRef.current) {
            setIsVideoReady(true); // Still set ready to allow UI to progress
          }
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
