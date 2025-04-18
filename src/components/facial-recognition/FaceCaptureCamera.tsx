
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCameraStream } from "@/hooks/useCameraStream";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useLoading } from "@/hooks/useLoading";
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
  const { videoRef, hasError, switchCamera, facingMode, hasCamera, isLoading, lastErrorMessage } = useCameraStream(isCameraActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(1.6);
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
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Debug logging for video element state
  useEffect(() => {
    if (videoRef.current && isCameraActive) {
      console.log("Video element current state:", {
        readyState: videoRef.current.readyState,
        paused: videoRef.current.paused,
        srcObject: videoRef.current.srcObject ? "Set" : "Not set",
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight
      });
    }
  }, [isCameraActive, isLoading]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
      try {
        console.log("Capturing image from video stream");
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const scale = isMobile ? 0.8 : 1;
        
        // Make sure we have video dimensions
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;
        
        console.log("Video dimensions:", videoWidth, "x", videoHeight);
        
        canvas.width = videoWidth * scale;
        canvas.height = videoHeight * scale;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.imageSmoothingQuality = 'high';
          
          if (facingMode === "user") {
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
          }
          
          context.filter = `brightness(${brightness}) contrast(1.2) saturate(1.1)`;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          context.filter = 'none';
          
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          console.log("Image captured successfully");
          
          // Store the captured image in a global variable to make it accessible
          // This is crucial for debugging - check this in dev tools console
          (window as any).capturedImage = imageDataUrl;
          
          if (mountedRef.current) {
            // Send the captured image to the parent component
            if (typeof onCapture === 'function') {
              // Store the image data in a ref that parent components can access
              if (typeof window !== 'undefined') {
                localStorage.setItem('tempCapturedImage', imageDataUrl);
              }
              
              onCapture();
              toast.success("Imagem capturada com sucesso!");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao capturar imagem:", error);
        if (mountedRef.current) {
          setErrorMessage("Falha ao processar imagem da câmera");
          toast.error("Erro ao capturar imagem. Tente novamente.");
        }
      }
    } else if (!faceDetected && mountedRef.current) {
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
            <canvas ref={canvasRef} className="hidden" width="640" height="480" />
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
