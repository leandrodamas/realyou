
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCameraStream = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasCamera, setHasCamera] = useState<boolean>(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          // Check if MediaDevices is supported
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("MediaDevices not supported");
          }
          
          // First check if we have cameras available
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          
          if (videoDevices.length === 0) {
            setHasCamera(false);
            throw new Error("No camera detected");
          }
          
          setHasCamera(true);
          
          // Request camera access with specific constraints for mobile
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }, 
            audio: false 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(error => {
              console.error("Error playing video:", error);
            });
            setHasError(false);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasError(true);
          toast.error("Não foi possível acessar sua câmera. Verifique as permissões.");
        }
      } else if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, facingMode]);

  const switchCamera = () => {
    setFacingMode(current => current === "user" ? "environment" : "user");
  };

  return { videoRef, hasError, switchCamera, facingMode, hasCamera };
};
