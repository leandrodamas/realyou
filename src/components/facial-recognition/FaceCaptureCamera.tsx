
import React, { useRef, useState, useEffect } from "react";
import { useCameraStream } from "@/hooks/useCameraStream";
import { captureImage } from "./utils/captureUtils";
import CameraContent from "./components/CameraContent";
import IntroContainer from "./components/IntroContainer";

interface FaceCaptureCameraProps {
  isCameraActive: boolean;
  feedbackMessage?: string;
  onToggleCamera: () => void;
}

const FaceCaptureCamera: React.FC<FaceCaptureCameraProps> = ({
  isCameraActive,
  feedbackMessage,
  onToggleCamera,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(2.0);
  const mountedRef = useRef<boolean>(true);
  const [startupAttempted, setStartupAttempted] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const { 
    videoRef, 
    hasError, 
    switchCamera, 
    facingMode, 
    hasCamera, 
    isLoading,
    errorMessage,
    errorType,
    isVideoReady
  } = useCameraStream(isCameraActive);
  
  console.log("FaceCaptureCamera rendered:", {
    isCameraActive,
    capturedImage: capturedImage ? "image exists" : null,
    hasError,
    isLoading,
    hasCamera,
    startupAttempted,
    isVideoReady,
    videoRef: videoRef.current ? "exists" : "null",
    videoReadyState: videoRef.current?.readyState
  });
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Auto-start camera if it's being requested
  useEffect(() => {
    if (isCameraActive && !startupAttempted) {
      console.log("FaceCaptureCamera: Ativação de câmera detectada");
      setStartupAttempted(true);
      
      // Try to kick-start camera initialization
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => console.log("FaceCaptureCamera: Permissão inicial concedida"))
          .catch(err => console.error("FaceCaptureCamera: Erro na permissão inicial:", err));
      }
    }
  }, [isCameraActive, startupAttempted]);

  // Reset startup flag when camera is deactivated
  useEffect(() => {
    if (!isCameraActive) {
      setStartupAttempted(false);
    }
  }, [isCameraActive]);

  const handleCapture = () => {
    captureImage({
      videoRef,
      canvasRef,
      facingMode,
      brightness,
      onCaptureComplete: () => {
        if (mountedRef.current) {
          // Handle capture completion
          console.log("Image captured successfully");
        }
      }
    });
  };

  const handleStartCamera = () => {
    onToggleCamera();
  };

  const handleReset = () => {
    setCapturedImage(null);
    onToggleCamera();
  };

  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 0.3, 3.0));
  };

  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 0.3, 0.8));
  };

  // If camera is not active or there's a captured image, show the intro container
  if (!isCameraActive || capturedImage) {
    return (
      <IntroContainer 
        isCameraActive={isCameraActive}
        capturedImage={capturedImage}
        onStartCamera={handleStartCamera}
        onReset={handleReset}
      />
    );
  }

  // If camera is active, show the camera content
  return (
    <CameraContent
      videoRef={videoRef}
      canvasRef={canvasRef}
      isLoading={isLoading}
      hasError={hasError}
      hasCamera={hasCamera}
      errorMessage={errorMessage}
      errorType={errorType}
      facingMode={facingMode}
      brightness={brightness}
      onCapture={handleCapture}
      switchCamera={switchCamera}
      increaseBrightness={increaseBrightness}
      decreaseBrightness={decreaseBrightness}
      onReset={handleReset}
    />
  );
};

export default FaceCaptureCamera;
