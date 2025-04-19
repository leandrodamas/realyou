
import React, { useState, useEffect } from "react";
import FaceCamera from "./FaceCamera";
import CapturedImage from "./CapturedImage";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FaceRegistrationProps {
  onImageCaptured: (imageData: string) => void;
  defaultImage?: string | null;
}

const FaceRegistration: React.FC<FaceRegistrationProps> = ({
  onImageCaptured,
  defaultImage = null
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(defaultImage);
  const [cameraKey, setCameraKey] = useState<number>(0); // Key for forcing camera remount
  
  // Check for existing camera permissions
  useEffect(() => {
    if (navigator.mediaDevices && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          console.log("Camera permission status:", permissionStatus.state);
          
          // Log permission changes
          permissionStatus.onchange = () => {
            console.log("Camera permission changed to:", permissionStatus.state);
            if (permissionStatus.state === 'granted' && showCamera) {
              // Force camera remount if permissions just got granted
              handleRestartCamera();
            }
          };
        })
        .catch(error => {
          console.log("Error checking camera permission:", error);
        });
    }
  }, [showCamera]);
  
  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
  };
  
  const handleConfirm = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };
  
  const handleRetake = () => {
    setShowCamera(true);
  };
  
  const handleRestartCamera = () => {
    // Força a remontagem do componente da câmera
    setCameraKey(prevKey => prevKey + 1);
    toast.info("Reiniciando câmera...");
  };
  
  if (showCamera) {
    return (
      <div className="relative">
        <FaceCamera
          key={cameraKey} // Using key to force remount when needed
          onCapture={handleCapture}
          onCancel={() => setShowCamera(false)}
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-black/30 text-white border-white/30 hover:bg-black/50"
            onClick={handleRestartCamera}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reiniciar
          </Button>
        </div>
      </div>
    );
  }
  
  if (capturedImage) {
    return (
      <CapturedImage
        imageData={capturedImage}
        onRetake={handleRetake}
        onConfirm={handleConfirm}
      />
    );
  }
  
  // Initial state - prompt to take photo
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg h-[400px]">
      <div className="text-gray-400 mb-4">
        <Camera size={48} />
      </div>
      <h3 className="text-lg font-medium mb-2">Reconhecimento Facial</h3>
      <p className="text-gray-500 text-center mb-4">
        Capture uma foto do seu rosto para autenticação
      </p>
      <div className="space-y-2">
        <Button onClick={() => setShowCamera(true)} className="w-full">
          Iniciar Câmera
        </Button>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Se tiver problemas com a câmera, verifique as permissões nas configurações do seu navegador
        </p>
      </div>
    </div>
  );
};

export default FaceRegistration;
