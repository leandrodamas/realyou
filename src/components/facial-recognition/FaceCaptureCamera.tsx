
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useCameraStream } from "@/hooks/useCameraStream";
import CameraError from "./CameraError";
import CameraLoading from "./components/CameraLoading";
import CameraPreview from "./components/CameraPreview";
import IntroSection from "./components/IntroSection";
import CapturedImageView from "./components/CapturedImageView";
import CaptureCanvas from "./components/CaptureCanvas";

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
  const { 
    videoRef, 
    hasError, 
    switchCamera, 
    facingMode, 
    hasCamera, 
    isLoading,
    errorMessage,
    errorType
  } = useCameraStream(isCameraActive);
  const [brightness, setBrightness] = useState(2.0);
  const mountedRef = useRef<boolean>(true);
  
  // Log component rendering and props
  console.log("FaceCaptureCamera rendered with:", {
    isCameraActive,
    capturedImage: capturedImage ? "image exists" : null,
    hasError,
    isLoading,
    hasCamera
  });
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Auto-start camera if it's being requested
  useEffect(() => {
    if (isCameraActive) {
      console.log("Camera activation detected in FaceCaptureCamera");
    }
  }, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        console.log("Capturando imagem estática da câmera");
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Use default values if video doesn't have dimensions yet
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;
        
        console.log("Dimensões do vídeo:", videoWidth, "x", videoHeight);
        
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
          console.log("Imagem capturada com sucesso");
          
          if (mountedRef.current) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('tempCapturedImage', imageDataUrl);
              console.log("Imagem salva no localStorage");
            }
            
            onCapture();
            toast.success("Imagem capturada com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao capturar imagem:", error);
        if (mountedRef.current) {
          toast.error("Erro ao capturar imagem. Tente novamente.");
        }
      }
    } else if (!videoRef.current) {
      toast.error("Câmera não inicializada");
    }
  };

  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 0.3, 3.0));
    toast.success("Brilho aumentado");
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 0.3, 0.8));
    toast.success("Brilho reduzido");
  };

  if (!isCameraActive && !capturedImage) {
    console.log("Rendering IntroSection");
    return <IntroSection onStartCamera={onStartCamera} />;
  }

  if (isCameraActive) {
    console.log("Camera active, loading:", isLoading);
    if (isLoading) {
      return <CameraLoading loadingProgress={0} />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        {hasError || !hasCamera ? (
          <CameraError 
            onReset={onReset} 
            errorMessage={errorMessage}
            errorType={errorType}
          />
        ) : (
          <>
            <CameraPreview
              videoRef={videoRef}
              faceDetected={true}
              onCapture={handleCapture}
              brightness={brightness}
              facingMode={facingMode}
              onSwitchCamera={switchCamera}
              onIncreaseBrightness={increaseBrightness}
              onDecreaseBrightness={decreaseBrightness}
              errorMessage={errorMessage}
            />
            <CaptureCanvas ref={canvasRef} />
          </>
        )}
      </div>
    );
  }

  return <CapturedImageView imageUrl={capturedImage || ''} onReset={onReset} />;
};

export default FaceCaptureCamera;
