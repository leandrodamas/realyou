
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, FlipHorizontal, AlertCircle, SunMedium } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCameraStream } from "@/hooks/useCameraStream";
import CameraError from "./CameraError";
import FaceDetectionStatus from "./FaceDetectionStatus";
import CameraOverlay from "./CameraOverlay";

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
  const [faceDetected, setFaceDetected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { videoRef, hasError, switchCamera, facingMode, hasCamera, isLoading } = useCameraStream(isCameraActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [brightness, setBrightness] = useState(1.4); // Default increased brightness
  
  // Simular progresso de carregamento para feedback visual
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

  useEffect(() => {
    // Adicionar atraso para inicialização da câmera
    let timer: NodeJS.Timeout;
    if (isCameraActive) {
      setIsInitializing(true);
      timer = setTimeout(() => {
        setIsInitializing(false);
      }, 1500); // Tempo reduzido para melhor UX
    }
    return () => clearTimeout(timer);
  }, [isCameraActive]);

  // Detecção facial simulada mais eficiente para mobile
  useEffect(() => {
    let detectInterval: NodeJS.Timeout;
    
    if (isCameraActive && !isInitializing && !isLoading && videoRef.current) {
      // Detecção mais leve para mobile
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const intervalTime = isMobileDevice ? 800 : 500; // Intervalo maior em dispositivos móveis
      
      detectInterval = setInterval(() => {
        if (!videoRef.current || !isCameraActive) {
          clearInterval(detectInterval);
          return;
        }
        
        // Simular detecção com mais chances de sucesso
        const detected = Math.random() > 0.2;
        setFaceDetected(detected);
      }, intervalTime);
    }
    
    return () => {
      if (detectInterval) clearInterval(detectInterval);
    };
  }, [isCameraActive, isInitializing, isLoading, videoRef.current]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Usar dimensões menores para melhor performance em mobile
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const scale = isMobile ? 0.7 : 1;
        
        canvas.width = (video.videoWidth || 640) * scale;
        canvas.height = (video.videoHeight || 480) * scale;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.imageSmoothingQuality = 'medium'; // Balanceamento entre qualidade e performance
          
          // Flip horizontal para câmera frontal
          if (facingMode === "user") {
            context.scale(-1, 1);
            context.translate(-canvas.width, 0);
          }
          
          // Aplicar ajustes de brilho/contraste para melhorar imagens escuras
          context.filter = `brightness(${brightness}) contrast(1.2) saturate(1.1)`;
          
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Reset filter after drawing
          context.filter = 'none';
          
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Aumentar qualidade
          
          // Parar a câmera para liberar recursos
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
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
    setBrightness(prev => Math.min(prev + 0.2, 2.0));
    toast.success("Brilho aumentado");
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 0.2, 1.0));
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
      return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] bg-gray-900">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
          <p className="text-white mb-4">Inicializando câmera...</p>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        {hasError || !hasCamera ? (
          <CameraError onReset={onReset} />
        ) : (
          <>
            <div className="relative w-full h-[75vh] bg-black">
              <video 
                ref={videoRef} 
                className="h-full w-full object-cover"
                autoPlay 
                playsInline 
                muted
                style={{ 
                  transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  filter: `brightness(${brightness}) contrast(1.2)`
                }}
              />
              
              <CameraOverlay faceDetected={faceDetected} />
              <FaceDetectionStatus faceDetected={faceDetected} />

              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-black/50 hover:bg-black/70"
                  onClick={switchCamera}
                >
                  <FlipHorizontal className="h-4 w-4 text-white" />
                </Button>
                
                {/* Brightness controls */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-yellow-500/70 hover:bg-yellow-500/90"
                  onClick={increaseBrightness}
                >
                  <SunMedium className="h-4 w-4 text-white" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-gray-700/70 hover:bg-gray-700/90"
                  onClick={decreaseBrightness}
                >
                  <SunMedium className="h-4 w-4 text-white opacity-70" />
                </Button>
              </div>

              <div className="absolute bottom-8 w-full flex justify-center gap-4">
                <Button 
                  onClick={handleCapture} 
                  className={`rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100 ${
                    faceDetected ? "pulse-animation" : "opacity-80"
                  }`}
                  disabled={!faceDetected}
                >
                  <Camera className="h-8 w-8" />
                </Button>
              </div>

              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-700">
                  {faceDetected ? "Clique no botão para capturar" : "Posicione seu rosto no centro"}
                </div>
              </div>
              
              {errorMessage && (
                <div className="absolute bottom-32 left-0 right-0 flex justify-center">
                  <div className="bg-red-500/80 text-white px-3 py-1 rounded-md text-xs">
                    {errorMessage}
                  </div>
                </div>
              )}
            </div>
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
