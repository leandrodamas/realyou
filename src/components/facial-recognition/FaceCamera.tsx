
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, FlipHorizontal, X } from "lucide-react";
import { useCameraStream } from "@/hooks/useCameraStream";
import CameraError from "./CameraError";
import { toast } from "sonner";

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

  // Reference to track component mounting state
  const mountedRef = useRef(true);
  // Track manual camera restart attempts
  const restartAttemptsRef = useRef(0);
  // Track if camera was started by user interaction
  const [cameraStarted, setCameraStarted] = useState(false);
  // Track if we showed a temporary message to the user
  const [showedTempMessage, setShowedTempMessage] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    
    // Identificar dispositivo para tratamento específico
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    // Mostrar mensagem de dica em dispositivos móveis após um tempo
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
    
    // Levantar uma ação de usuário em dispositivos móveis para ativar a câmera
    const unlockCamera = () => {
      if (!cameraStarted && mountedRef.current) {
        console.log("Tentativa de desbloqueio da câmera por interação do usuário");
        setCameraStarted(true);
        
        // Em iOS, criar e clicar em um botão temporário para garantir início do vídeo
        if (isIOS && videoRef.current) {
          if (videoRef.current.paused && videoRef.current.srcObject) {
            console.log("Tentando iniciar vídeo através de interação");
            videoRef.current.play().catch(e => {
              console.log("Erro ao iniciar vídeo através de interação:", e);
            });
          }
        }
      }
    };
    
    // Adicionar event listeners para detectar interação do usuário
    document.addEventListener('touchend', unlockCamera);
    document.addEventListener('click', unlockCamera);
    
    // Adicionar verificação periódica para garantir que o vídeo está em execução
    const periodicCheck = setInterval(() => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.paused && videoElement.srcObject) {
        console.log("Vídeo pausado, tentando reiniciar");
        videoElement.play().catch(e => {
          console.log("Erro ao reiniciar vídeo:", e);
          restartAttemptsRef.current++;
          
          // Se várias tentativas falharem, sugerir reinicialização completa
          if (restartAttemptsRef.current >= 3 && !showedTempMessage) {
            toast.error("Problemas ao iniciar câmera. Tente reiniciar.", {
              duration: 4000,
              id: "camera-restart-suggestion"
            });
            setShowedTempMessage(true);
          }
        });
      }
    }, 2000);
    
    // Em dispositivos iOS, tentar abordagens específicas
    if (isIOS) {
      // Criar um elemento de interação invisível para ajudar a iniciar o vídeo
      const invisibleButton = document.createElement('button');
      invisibleButton.style.position = 'fixed';
      invisibleButton.style.opacity = '0.01';
      invisibleButton.style.width = '1px';
      invisibleButton.style.height = '1px';
      invisibleButton.textContent = 'Start Camera';
      document.body.appendChild(invisibleButton);
      
      setTimeout(() => {
        invisibleButton.click();
        document.body.removeChild(invisibleButton);
      }, 500);
    }
    
    // Tenta obter wakelock para evitar que a tela desligue
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // @ts-ignore
          const wakeLock = await navigator.wakeLock.request('screen');
          console.log('Wake lock is active');
          return wakeLock;
        } catch (err) {
          console.log('Wake lock request failed:', err);
          return null;
        }
      }
      return null;
    };
    
    let wakeLockObj: any = null;
    requestWakeLock().then(lock => {
      wakeLockObj = lock;
    });
    
    return () => {
      mountedRef.current = false;
      clearInterval(periodicCheck);
      clearTimeout(tempMessageTimer);
      document.removeEventListener('touchend', unlockCamera);
      document.removeEventListener('click', unlockCamera);
      
      // Liberar wakelock
      if (wakeLockObj) {
        try {
          wakeLockObj.release().catch(() => {});
        } catch (e) {
          console.log("Erro ao liberar wakelock:", e);
        }
      }
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
      
      // Use video dimensions or default values
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
      
      // Mirror the image if using the front camera
      if (facingMode === "user") {
        context.translate(width, 0);
        context.scale(-1, 1);
      }
      
      // Capture frame from video with enhanced brightness
      context.filter = "brightness(1.2) contrast(1.1)";
      context.drawImage(video, 0, 0, width, height);
      context.filter = "none";
      
      // Convert to data URL with higher quality
      const imageData = canvas.toDataURL('image/jpeg', 0.92);
      onCapture(imageData);
      
      // Log success
      console.log("Imagem capturada com sucesso:", width, "x", height);
    } catch (error) {
      console.error("Error capturing image:", error);
      toast.error("Erro ao capturar imagem");
    }
  };
  
  // Função para recarregar completamente a página
  const handleFullReload = () => {
    toast.info("Reiniciando câmera...");
    window.location.reload();
  };
  
  // Show camera error with enhanced props
  if (hasError) {
    return (
      <CameraError 
        onReset={handleFullReload} 
        errorMessage={errorMessage || lastErrorMessage}
        errorType={errorType}
        retryCount={retryCount}
      />
    );
  }
  
  // Show loading state
  if (isLoading || !isVideoReady) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-6 h-[400px]">
        <div className="animate-spin mb-4">
          <Camera size={36} className="text-white" />
        </div>
        <p className="text-white">Iniciando câmera...</p>
        <p className="text-white/70 text-xs mt-2 text-center px-4">
          Aguarde um momento para a câmera inicializar. 
          Se essa tela persistir, tente permitir acesso à câmera nas configurações do seu dispositivo.
        </p>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleFullReload}
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reiniciar câmera
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="text-white border-white/30 hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }
  
  // No camera found
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
    <div className="relative bg-black rounded-lg overflow-hidden h-[400px]">
      {/* Video element with correct styling */}
      <video 
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{
          transform: facingMode === "user" ? "scaleX(-1)" : "none",
        }}
        playsInline
        autoPlay
        muted
      />
      
      {/* Face detection indicator */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`border-4 rounded-full w-64 h-64 mx-auto mt-12 transition-all ${
          faceDetected ? "border-green-500 scale-105" : "border-white/30"
        }`} />
      </div>
      
      {/* Status message */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <div className="bg-black/60 text-white rounded-full px-4 py-2">
          {faceDetected ? "Rosto detectado! Clique para capturar" : "Posicione seu rosto no centro"}
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between">
        <Button variant="ghost" className="text-white" onClick={onCancel}>
          Cancelar
        </Button>
        
        <Button 
          size="lg"
          className={`rounded-full bg-white ${faceDetected ? "animate-pulse" : ""}`}
          onClick={handleCapture}
        >
          <Camera className="h-6 w-6 text-black" />
        </Button>
        
        <Button variant="ghost" className="text-white" onClick={switchCamera}>
          <FlipHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default FaceCamera;
