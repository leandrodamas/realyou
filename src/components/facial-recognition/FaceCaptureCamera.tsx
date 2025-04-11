
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

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
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl aspect-square w-full relative overflow-hidden border border-gray-100 shadow-inner">
      {isCameraActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          {/* Camera view would be shown here in a real implementation */}
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-white">Camera Preview</p>
          </div>
          <div className="absolute bottom-4 w-full flex justify-center">
            <Button onClick={onCapture} className="rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100">
              <Camera className="h-8 w-8" />
            </Button>
          </div>
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
