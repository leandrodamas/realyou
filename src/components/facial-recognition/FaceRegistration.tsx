
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import FaceCamera from "./FaceCamera";
import CapturedImage from "./CapturedImage";

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
        })
        .catch(error => {
          console.log("Error checking camera permission:", error);
        });
    }
  }, []);
  
  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
  };
  
  const handleConfirm = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
      toast.success("Foto salva com sucesso");
    }
  };
  
  const handleRetake = () => {
    setShowCamera(true);
  };
  
  const handleRestartCamera = () => {
    setCameraKey(prevKey => prevKey + 1);
    toast.info("Reiniciando câmera...");
  };
  
  if (showCamera) {
    return (
      <div className="relative">
        <FaceCamera
          key={cameraKey}
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
      <h3 className="text-lg font-medium mb-2">Foto de Perfil</h3>
      <p className="text-gray-500 text-center mb-4">
        Capture uma foto clara do seu rosto para seu perfil
      </p>
      <div className="space-y-2">
        <Button onClick={() => setShowCamera(true)} className="w-full">
          Iniciar Câmera
        </Button>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Esta foto será usada para seu perfil e para que outros usuários possam te encontrar
        </p>
      </div>
    </div>
  );
};

export default FaceRegistration;
