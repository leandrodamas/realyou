
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, CameraOff, Move } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, size: 0 });

  // Initialize camera stream when isCameraActive changes
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      if (isCameraActive) {
        try {
          // Request access to the user's camera with higher resolution
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }, 
            audio: false 
          });
          
          // Connect the stream to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasError(false);
            
            // Give it a moment to start before attempting face detection simulation
            setTimeout(() => {
              simulateFaceDetection();
            }, 1000);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasError(true);
          toast.error("Não foi possível acessar sua câmera. Verifique as permissões.");
        }
      } else if (stream) {
        // Stop all tracks when camera is deactivated
        stream.getTracks().forEach(track => track.stop());
      }
    };

    setupCamera();

    // Cleanup: stop camera stream when component unmounts or camera is deactivated
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  // Simulate face detection - in a real app this would use the actual SDK
  const simulateFaceDetection = () => {
    // This simulates periodic updates to face position
    // In a real implementation, this would use the SDK to detect faces
    
    const detectInterval = setInterval(() => {
      if (!isCameraActive || !videoRef.current) {
        clearInterval(detectInterval);
        return;
      }
      
      // Randomly determine if a face is detected (90% chance)
      const detected = Math.random() > 0.1;
      
      if (detected) {
        // Simulate face position with small random movements
        const centerX = videoRef.current.videoWidth / 2;
        const centerY = videoRef.current.videoHeight / 2;
        const size = videoRef.current.videoWidth * 0.35;
        
        // Add small random movement to simulate slight detection variations
        const jitter = 10;
        const newPosition = {
          x: centerX + (Math.random() * jitter * 2 - jitter),
          y: centerY + (Math.random() * jitter * 2 - jitter),
          size: size + (Math.random() * 5)
        };
        
        setFacePosition(newPosition);
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }
    }, 500);
    
    return () => clearInterval(detectInterval);
  };

  // Function to capture image from the video stream
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && faceDetected) {
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
        setLocalCapturedImage(imageDataUrl);
        
        // Stop the camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        
        // Pass the captured image data URL to parent component
        onCapture();
        
        // Let user know capture was successful
        toast.success("Imagem capturada com sucesso!");
      }
    } else if (!faceDetected) {
      toast.warning("Nenhum rosto detectado. Centralize seu rosto na câmera.");
    }
  };

  // Get the image to display - either from local state or from parent props
  const displayImage = localCapturedImage || capturedImage;

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
                
                {/* Face detection oval guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Overlay with cutout */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 z-10">
                    {/* Cutout oval */}
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <mask id="oval-mask">
                          <rect width="100%" height="100%" fill="white" />
                          <ellipse cx="50%" cy="50%" rx="30%" ry="40%" fill="black" />
                        </mask>
                      </defs>
                      <rect width="100%" height="100%" fill="black" mask="url(#oval-mask)" fillOpacity="0.5" />
                    </svg>
                  </div>
                  
                  {/* Face detection status indicator */}
                  <div className="absolute top-6 left-0 right-0 flex justify-center">
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      faceDetected 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {faceDetected ? (
                        <>
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                          Rosto detectado
                        </>
                      ) : (
                        <>
                          <Move className="h-3 w-3" />
                          Centralize seu rosto
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Face detection outline - only show when face is detected */}
                  {faceDetected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute border-2 border-green-400 rounded-full"
                      style={{
                        width: "60%",
                        height: "80%",
                        boxShadow: "0 0 0 1px rgba(74, 222, 128, 0.2)",
                      }}
                    ></motion.div>
                  )}
                </div>
              </div>
              
              {/* Capture button */}
              <div className="absolute bottom-4 w-full flex justify-center">
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
              
              {/* Instructions for user */}
              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-700">
                  {faceDetected ? "Clique no botão para capturar" : "Posicione seu rosto no centro"}
                </div>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : displayImage ? (
        <div className="relative w-full h-full">
          <img 
            src={displayImage} 
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
            className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md"
          >
            Iniciar Câmera
          </Button>
        </div>
      )}
    </div>
  );
};

export default FaceCaptureCamera;
