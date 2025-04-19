
import React, { useState } from "react";
import FaceCamera from "./FaceCamera";
import CapturedImage from "./CapturedImage";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

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
  
  if (showCamera) {
    return (
      <FaceCamera
        onCapture={handleCapture}
        onCancel={() => setShowCamera(false)}
      />
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
      <Button onClick={() => setShowCamera(true)}>
        Iniciar Câmera
      </Button>
    </div>
  );
};

export default FaceRegistration;
