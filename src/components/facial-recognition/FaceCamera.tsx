
import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    mountedRef.current = true;
    
    // Identify device for platform-specific handling
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // Force a component update to refresh video element
    const forceRefreshTimeout = setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.paused && videoElement.srcObject) {
        console.log("Attempting to restart paused video");
        videoElement.play().catch(err => 
          console.error("Error during forced video play:", err)
        );
      }
    }, 1000);
    
    // Add periodic checks to ensure video is playing
    const periodicCheckInterval = setInterval(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
        // Log video state for debugging
        console.log("Video state check:", {
          paused: videoElement.paused,
          readyState: videoElement.readyState,
          srcObject: !!videoElement.srcObject,
          width: videoElement.videoWidth,
          height: videoElement.videoHeight
        });
        
        // Try to play if paused but has source
        if (videoElement.paused && videoElement.srcObject) {
          console.log("Auto-play attempt for paused video");
          videoElement.play().catch(() => {
            // If play fails multiple times, suggest page reload
            if (mountedRef.current && !isLoading && restartAttemptsRef.current > 3) {
              toast.error("Problema ao iniciar vídeo. Tente recarregar a página.", {
                duration: 5000,
                id: "camera-restart-error"
              });
            }
          });
          restartAttemptsRef.current++;
        }
      }
    }, 3000);
    
    // Handle iOS specific behavior
    if (isIOS) {
      // For iOS we need to handle touch events to trigger video playback
      document.body.addEventListener('touchend', handleIOSTouch);
      
      // iOS often needs a direct element click, add a hidden button that gets clicked
      const iosHelper = document.createElement('button');
      iosHelper.style.position = 'fixed';
      iosHelper.style.opacity = '0';
      iosHelper.style.pointerEvents = 'none';
      document.body.appendChild(iosHelper);
      
      setTimeout(() => {
        iosHelper.click();
        document.body.removeChild(iosHelper);
      }, 1000);
    }
    
    // Handle Android specific behavior
    if (isAndroid) {
      // For Android we need repeated attempts
      let androidAttempts = 0;
      const androidInterval = setInterval(() => {
        androidAttempts++;
        const videoElement = videoRef.current;
        if (videoElement && !videoElement.videoWidth && androidAttempts < 5) {
          console.log("Android camera retry attempt", androidAttempts);
          
          if (videoElement.srcObject) {
            videoElement.play().catch(() => {});
          }
        } else {
          clearInterval(androidInterval);
        }
      }, 1000);
    }
    
    // Request wakelock to prevent screen from sleeping
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // @ts-ignore - WakeLock may not be in all TS definitions
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
    
    // Try to get wake lock
    let wakeLockObj: any = null;
    requestWakeLock().then(lock => {
      wakeLockObj = lock;
    });
    
    return () => {
      mountedRef.current = false;
      clearTimeout(forceRefreshTimeout);
      clearInterval(periodicCheckInterval);
      
      if (isIOS) {
        document.body.removeEventListener('touchend', handleIOSTouch);
      }
      
      // Release wake lock if we have one
      if (wakeLockObj) {
        wakeLockObj.release().catch(() => {});
      }
    };
  }, []);
  
  // Helper function for iOS touch handler
  const handleIOSTouch = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.paused && videoElement.srcObject) {
      console.log("iOS touch triggered video play attempt");
      videoElement.play().catch(() => {});
    }
  };
  
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
  
  // Show loading state but with a timer to avoid getting stuck
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
        <Button variant="outline" onClick={onCancel}>
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

      {/* Debug Status */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
        {videoRef.current ? 
          `Status: ${videoRef.current.readyState}/4 ${videoRef.current.paused ? '(pausado)' : '(rodando)'}` : 
          'Não inicializado'}
      </div>
      
      {/* Camera reload button */}
      <div className="absolute top-2 left-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-black/30" 
          onClick={handleFullReload}
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Reiniciar
        </Button>
      </div>
    </div>
  );
};

export default FaceCamera;
