
import { useRef, useState, useEffect } from "react";
import { cleanupCameraStream } from "../utils/cameraUtils";
import { toast } from "sonner";
import { CameraAccessState } from "./types";

export const useCameraAccess = (isCameraActive: boolean, facingMode: "user" | "environment"): CameraAccessState => {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupCameraStream(streamRef.current, videoRef.current);
    };
  }, []);

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
          await videoRef.current.play();
          console.log("Video playback started successfully");
        } catch (playError) {
          console.error("Error during video playback:", playError);
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
    initializeCamera,
    mountedRef
  };
};
