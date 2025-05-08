
import { toast } from "sonner";

interface CaptureOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  facingMode: "user" | "environment";
  brightness: number;
  onCaptureComplete: () => void;
}

export const captureImage = ({
  videoRef,
  canvasRef,
  facingMode,
  brightness,
  onCaptureComplete
}: CaptureOptions): void => {
  if (!videoRef.current || !canvasRef.current) {
    if (!videoRef.current) {
      toast.error("Câmera não inicializada");
    }
    return;
  }

  try {
    console.log("FaceCaptureCamera: Capturando imagem estática da câmera");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Use default values if video doesn't have dimensions yet
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    
    console.log("FaceCaptureCamera: Dimensões do vídeo:", videoWidth, "x", videoHeight);
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.imageSmoothingQuality = 'high';
      
      if (facingMode === "user") {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      
      context.filter = `brightness(${brightness}) contrast(1.2)`;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.filter = 'none';
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      console.log("FaceCaptureCamera: Imagem capturada com sucesso");
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('tempCapturedImage', imageDataUrl);
        console.log("FaceCaptureCamera: Imagem salva no localStorage");
      }
      
      onCaptureComplete();
      toast.success("Imagem capturada com sucesso!");
    }
  } catch (error) {
    console.error("FaceCaptureCamera: Erro ao capturar imagem:", error);
    toast.error("Erro ao capturar imagem. Tente novamente.");
  }
};
