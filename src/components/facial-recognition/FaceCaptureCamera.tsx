import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCameraStream } from "@/hooks/useCameraStream";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import CameraError from "./CameraError";
import CameraLoading from "./components/CameraLoading";
import CameraPreview from "./components/CameraPreview";

interface FaceCaptureCameraProps {
  isCameraActive: boolean;
  capturedImage: string | null;
  onStartCamera: () => void;
  onCapture: () => void;
  onReset: () => void;
}

const FaceCaptureCamera: React.FC<FaceCaptureCameraProps> = ({
  isCameraActive,
  capturedImage,
  onStartCamera,
  onCapture,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { videoRef, hasError, switchCamera, facingMode, hasCamera, isLoading } = useCameraStream(isCameraActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [brightness, setBrightness] = useState(1.4);

  const { faceDetected } = useFaceDetection({
    isCameraActive,
    isInitializing,
    isLoading,
    videoRef
  });

  // Loading progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading || isInitializing) {
      let progress = 0;
      interval = setInterval(() => {
        progress += 5;
        if (progress > 95) {
          clearInterval(interval);
          progress = 95;
        }
        setLoadingProgress(progress);
      }, 100);
    } else {
      setLoadingProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, isInitializing]);

  // Camera initialization delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCameraActive) {
      setIsInitializing(true);
      timer = setTimeout(() => {
        setIsInitializing(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const scale = isMobile ? 0.7 : 1;
        
        canvas.width = (video.videoWidth || 640) * scale;
        canvas.height = (video.videoHeight || 480) * scale;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.imageSmoothingQuality = 'medium';
          
          if (facingMode === "user") {
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
          }
          
          context.filter = `brightness(${brightness}) contrast(1.2) saturate(1.1)`;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          context.filter = 'none';
          
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
          }
          
          onCapture();
          toast.success("Imagem capturada com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao capturar imagem:", error);
        setErrorMessage("Falha ao processar imagem da câmera");
        toast.error("Erro ao capturar imagem. Tente novamente.");
      }
    } else if (!faceDetected) {
      toast.warning("Nenhum rosto detectado. Centralize seu rosto na câmera.");
    }
  };

  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 0.3, 2.5));
    toast.success("Brilho aumentado");
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 0.3, 0.8));
    toast.success("Brilho reduzido");
  };

  if (!isCameraActive && !capturedImage) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-1">Tire uma foto para se conectar</p>
          <p className="text-xs text-gray-400">Seja você mesmo, seja real</p>
        </div>
        <Button 
          onClick={onStartCamera}
          className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md"
        >
          Iniciar Câmera
        </Button>
      </div>
    );
  }

  if (isCameraActive) {
    if (isInitializing || isLoading) {
      return <CameraLoading loadingProgress={loadingProgress} />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        {hasError || !hasCamera ? (
          <CameraError onReset={onReset} />
        ) : (
          <>
            <CameraPreview
              videoRef={videoRef}
              faceDetected={faceDetected}
              onCapture={handleCapture}
              brightness={brightness}
              facingMode={facingMode}
              onSwitchCamera={switchCamera}
              onIncreaseBrightness={increaseBrightness}
              onDecreaseBrightness={decreaseBrightness}
              errorMessage={errorMessage}
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[75vh]">
      <img 
        src={capturedImage || ''} 
        alt="Captured face" 
        className="w-full h-full object-cover rounded-2xl"
      />
      <Button 
        variant="destructive" 
        size="icon"
        className="absolute top-3 right-3 rounded-full shadow-md"
        onClick={onReset}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FaceCaptureCamera;
