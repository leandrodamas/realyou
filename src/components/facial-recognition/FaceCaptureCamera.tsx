
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useCameraStream } from "@/hooks/useCameraStream";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useLoading } from "@/hooks/useLoading";
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
  const { videoRef, hasError, switchCamera, facingMode, hasCamera, isLoading, lastErrorMessage } = useCameraStream(isCameraActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(2.0);
  const mountedRef = useRef<boolean>(true);
  
  const { isInitializing, loadingProgress } = useLoading({ isCameraActive });
  
  const { faceDetected } = useFaceDetection({
    isCameraActive,
    isInitializing,
    isLoading,
    videoRef
  });

  useEffect(() => {
    mountedRef.current = true;

    let autoCapture: NodeJS.Timeout | null = null;
    if (isCameraActive && !isLoading && !isInitializing) {
      autoCapture = setTimeout(() => {
        if (mountedRef.current && videoRef.current && videoRef.current.readyState >= 2) {
          console.log("Auto-capturing image for testing");
          handleCapture();
        }
      }, 3000);
    }

    return () => {
      mountedRef.current = false;
      if (autoCapture) clearTimeout(autoCapture);
    };
  }, [isCameraActive, isLoading, isInitializing]);

  useEffect(() => {
    const debugInterval = setInterval(() => {
      if (videoRef.current && isCameraActive) {
        console.log("Video debug info:", {
          readyState: videoRef.current.readyState,
          paused: videoRef.current.paused,
          videoWidth: videoRef.current.videoWidth,
          videoHeight: videoRef.current.videoHeight,
          faceDetected: faceDetected
        });
      }
    }, 2000);
    
    return () => clearInterval(debugInterval);
  }, [isCameraActive, faceDetected]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        console.log("Capturing image from video stream");
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;
        
        console.log("Video dimensions:", videoWidth, "x", videoHeight);
        
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
          console.log("Image captured successfully");
          
          (window as any).capturedImage = imageDataUrl;
          
          if (mountedRef.current) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('tempCapturedImage', imageDataUrl);
              console.log("Image saved to localStorage");
            }
            
            onCapture();
            toast.success("Imagem capturada com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao capturar imagem:", error);
        if (mountedRef.current) {
          setErrorMessage("Falha ao processar imagem da câmera");
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
    return <IntroSection onStartCamera={onStartCamera} />;
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
            <CaptureCanvas ref={canvasRef} />
          </>
        )}
      </div>
    );
  }

  return <CapturedImageView imageUrl={capturedImage || ''} onReset={onReset} />;
};

export default FaceCaptureCamera;
