
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCameraStream } from "@/hooks/useCameraStream";
import { Button } from "@/components/ui/button";
import CameraError from "./CameraError";
import CameraPreview from "./components/CameraPreview";

interface FaceCameraProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const FaceCamera: React.FC<FaceCameraProps> = ({ onCapture, onCancel }) => {
  const {
    videoRef,
    isLoading,
    hasCamera,
    hasError,
    errorMessage,
    lastErrorMessage,
    errorType,
    facingMode,
    switchCamera,
    faceDetected,
    isVideoReady,
    retryCount
  } = useCameraStream(true);

  const mountedRef = useRef(true);
  const restartAttemptsRef = useRef(0);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showedTempMessage, setShowedTempMessage] = useState(false);
  const [brightness, setBrightness] = useState(2.0);

  useEffect(() => {
    mountedRef.current = true;
    
    // Identify device for specific handling
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    // Show tip message on mobile devices after a delay
    let tempMessageTimer: NodeJS.Timeout;
    if (isMobile && !showedTempMessage) {
      tempMessageTimer = setTimeout(() => {
        toast.info("Toque na tela para ajudar a ativar a câmera", {
          duration: 4000,
          id: "camera-touch-tip"
        });
        setShowedTempMessage(true);
      }, 3000);
    }
    
    // Trigger user action on mobile devices to activate camera
    const unlockCamera = () => {
      if (!cameraStarted && mountedRef.current) {
        setCameraStarted(true);
        
        // On iOS, create and click a temporary button to ensure video starts
        if (isIOS && videoRef.current) {
          if (videoRef.current.paused && videoRef.current.srcObject) {
            videoRef.current.play().catch(e => {
              console.log("Error starting video through interaction:", e);
            });
          }
        }
      }
    };
    
    document.addEventListener('touchend', unlockCamera);
    document.addEventListener('click', unlockCamera);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(tempMessageTimer);
      document.removeEventListener('touchend', unlockCamera);
      document.removeEventListener('click', unlockCamera);
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) {
      toast.error("Câmera não está disponível");
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      if (!width || !height) {
        toast.error("Vídeo sem dimensões. Tente reiniciar a câmera.");
        return;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const context = canvas.getContext('2d');
      if (!context) {
        toast.error("Não foi possível criar contexto de captura");
        return;
      }
      
      if (facingMode === "user") {
        context.translate(width, 0);
        context.scale(-1, 1);
      }
      
      context.filter = "brightness(1.2) contrast(1.1)";
      context.drawImage(video, 0, 0, width, height);
      context.filter = "none";
      
      const imageData = canvas.toDataURL('image/jpeg', 0.92);
      onCapture(imageData);
      
      console.log("Imagem capturada com sucesso:", width, "x", height);
    } catch (error) {
      console.error("Error capturing image:", error);
      toast.error("Erro ao capturar imagem");
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

  if (hasError) {
    return (
      <CameraError 
        onReset={() => window.location.reload()} 
        errorMessage={errorMessage || lastErrorMessage}
        errorType={errorType}
        retryCount={retryCount}
      />
    );
  }

  if (!hasCamera) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg p-6 h-[400px]">
        <p className="mb-4">Nenhuma câmera encontrada</p>
        <Button variant="outline" onClick={onCancel} className="text-white border-white/30">
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <CameraPreview
      videoRef={videoRef}
      faceDetected={faceDetected}
      onCapture={handleCapture}
      brightness={brightness}
      facingMode={facingMode}
      onSwitchCamera={switchCamera}
      onIncreaseBrightness={increaseBrightness}
      onDecreaseBrightness={decreaseBrightness}
      errorMessage={errorMessage || lastErrorMessage}
    />
  );
};

export default FaceCamera;
