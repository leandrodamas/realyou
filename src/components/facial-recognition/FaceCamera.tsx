
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, FlipHorizontal, X } from "lucide-react";
import { useCameraStream } from "@/hooks/useCameraStream";
import CameraError from "./CameraError";

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

  useEffect(() => {
    // Force a component update after 2 seconds
    // This helps some browsers that need a second attempt to start the camera
    const forceRefreshTimeout = setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.paused && videoElement.srcObject) {
        console.log("Attempting to restart paused video");
        videoElement.play().catch(err => 
          console.error("Error during forced video play:", err)
        );
      }
    }, 2000);
    
    return () => clearTimeout(forceRefreshTimeout);
  }, []);
  
  const handleCapture = () => {
    if (!videoRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Use video dimensions or default values
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Mirror the image if using the front camera
      if (facingMode === "user") {
        context.translate(width, 0);
        context.scale(-1, 1);
      }
      
      // Capture frame from video
      context.drawImage(video, 0, 0, width, height);
      
      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageData);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };
  
  // Show camera error with enhanced props
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
  
  // Show loading state but with a timer to avoid getting stuck
  if (isLoading || !isVideoReady) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-6 h-[400px]">
        <div className="animate-spin mb-4">
          <Camera size={36} className="text-white" />
        </div>
        <p className="text-white">Iniciando câmera...</p>
        <p className="text-white/70 text-xs mt-2">
          Aguarde um momento para a câmera inicializar. 
          Se essa tela persistir por mais de 15 segundos, verifique as permissões da câmera.
        </p>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="mt-6 text-white border-white/30 hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
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

      {/* Debug Status - Remove in production */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
        {videoRef.current ? 
          `Video: ${videoRef.current.readyState}/4 ${videoRef.current.paused ? '(pausado)' : '(tocando)'}` : 
          'Video: não inicializado'}
      </div>
    </div>
  );
};

export default FaceCamera;
