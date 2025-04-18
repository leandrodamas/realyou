import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, FlipHorizontal } from "lucide-react";
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
  const { videoRef, hasError, switchCamera, facingMode } = useCameraStream(isCameraActive);

  const simulateFaceDetection = () => {
    const detectInterval = setInterval(() => {
      if (!isCameraActive || !videoRef.current) {
        clearInterval(detectInterval);
        return;
      }
      const detected = Math.random() > 0.1;
      setFaceDetected(detected);
    }, 500);
    
    return () => clearInterval(detectInterval);
  };

  React.useEffect(simulateFaceDetection, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally if using front camera
        if (facingMode === "user") {
          context.scale(-1, 1);
          context.translate(-canvas.width, 0);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        
        onCapture();
        toast.success("Imagem capturada com sucesso!");
      }
    } else if (!faceDetected) {
      toast.warning("Nenhum rosto detectado. Centralize seu rosto na câmera.");
    }
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        {hasError ? (
          <CameraError onReset={onReset} />
        ) : (
          <>
            <div className="relative w-full h-[75vh] bg-black">
              <video 
                ref={videoRef} 
                className="h-full w-full object-cover"
                autoPlay 
                playsInline 
                style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
              />
              
              <CameraOverlay faceDetected={faceDetected} />
              <FaceDetectionStatus faceDetected={faceDetected} />

              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-black/50 hover:bg-black/70"
                  onClick={switchCamera}
                >
                  <FlipHorizontal className="h-4 w-4 text-white" />
                </Button>
              </div>

              <div className="absolute bottom-4 w-full flex justify-center gap-4">
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
