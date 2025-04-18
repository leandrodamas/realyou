
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCameraStream = (isCameraActive: boolean) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
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
  }, [isCameraActive]);

  return { videoRef, hasError };
};
