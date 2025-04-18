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
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return null;
      }
      
      streamRef.current = stream;
      
      if (videoRef.current && mountedRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
      
      return stream;
    } catch (error) {
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
