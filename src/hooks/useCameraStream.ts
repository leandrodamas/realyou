
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCameraStream = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }, 
            audio: false 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
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

  return { videoRef, hasError, switchCamera, facingMode };
};
