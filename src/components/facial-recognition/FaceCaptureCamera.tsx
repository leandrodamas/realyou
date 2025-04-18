
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, CameraOff } from "lucide-react";
import { toast } from "sonner";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize camera stream when isCameraActive changes
  useEffect(() => {
    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          // Request access to the user's camera
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, // Use front camera
            audio: false 
          });
          
          // Connect the stream to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setHasError(false);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasError(true);
          toast.error("Não foi possível acessar sua câmera. Verifique as permissões.");
        }
      } else if (stream) {
        // Stop all tracks when camera is deactivated
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };

    setupCamera();

    // Cleanup: stop camera stream when component unmounts or camera is deactivated
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
  }, [isCameraActive]);

  // Function to capture image from the video stream
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        
        // Pass the captured image data URL to parent component
        if (videoRef.current) {
          videoRef.current.pause();
        }
        
        // Update parent component
        onCapture();
        
        // Stop the camera stream after capture - moved to a separate function
        stopCameraStream();
      }
    } else {
      console.error("Video or canvas reference not available");
      toast.error("Não foi possível capturar a imagem. Tente novamente.");
    }
  };

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl aspect-square w-full relative overflow-hidden border border-gray-100 shadow-inner">
      {isCameraActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <CameraOff className="h-12 w-12 text-white/60 mb-3" />
              <p className="text-white text-center px-6">Não foi possível acessar sua câmera</p>
              <p className="text-white/70 text-sm mt-1 text-center px-6">Verifique suas permissões de câmera</p>
              <Button 
                variant="outline" 
                className="mt-4 bg-white text-gray-800" 
                onClick={onReset}
              >
                Voltar
              </Button>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video 
                  ref={videoRef} 
                  className="h-full w-full object-cover"
                  autoPlay 
                  playsInline 
                />
              </div>
              <div className="absolute bottom-4 w-full flex justify-center">
                <Button 
                  onClick={handleCapture} 
                  className="rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100">
                  <Camera className="h-8 w-8" />
                </Button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : capturedImage ? (
        <div className="relative w-full h-full">
          <img 
            src={capturedImage} 
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
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-6 text-center">
            <p className="text-gray-600 mb-1">Tire uma foto para se conectar</p>
            <p className="text-xs text-gray-400">Seja você mesmo, seja real</p>
          </div>
          <Button 
            onClick={onStartCamera} 
            className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md">
            Iniciar Câmera
          </Button>
        </div>
      )}
    </div>
  );
};

export default FaceCaptureCamera;
