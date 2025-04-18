
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import CameraOverlay from "../CameraOverlay";
import FaceDetectionStatus from "../FaceDetectionStatus";
import CameraControls from "./CameraControls";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  faceDetected: boolean;
  onCapture: () => void;
  brightness: number;
  facingMode: "user" | "environment";
  onSwitchCamera: () => void;
  onIncreaseBrightness: () => void;
  onDecreaseBrightness: () => void;
  errorMessage: string | null;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  faceDetected,
  onCapture,
  brightness,
  facingMode,
  onSwitchCamera,
  onIncreaseBrightness,
  onDecreaseBrightness,
  errorMessage
}) => {
  return (
    <div className="relative w-full h-[75vh] bg-black">
      <video 
        ref={videoRef} 
        className="h-full w-full object-cover"
        autoPlay 
        playsInline 
        muted
        style={{ 
          transform: facingMode === "user" ? "scaleX(-1)" : "none",
          filter: `brightness(${brightness}) contrast(1.2)`,
          objectFit: "cover"
        }}
      />
      
      <CameraOverlay faceDetected={faceDetected} />
      <FaceDetectionStatus faceDetected={faceDetected} />

      <CameraControls
        onSwitchCamera={onSwitchCamera}
        onIncreaseBrightness={onIncreaseBrightness}
        onDecreaseBrightness={onDecreaseBrightness}
        brightness={brightness}
      />

      <div className="absolute bottom-8 w-full flex justify-center gap-4">
        <Button 
          onClick={onCapture} 
          className={`rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100 ${
            faceDetected ? "animate-pulse" : "opacity-70"
          }`}
          disabled={false} // Always enable the button for testing
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-base text-gray-800 font-medium">
          {faceDetected ? "Clique no botão para capturar" : "Posicione seu rosto no centro"}
        </div>
      </div>
      
      {errorMessage && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center">
          <div className="bg-red-500/90 text-white px-4 py-2 rounded-md text-sm font-medium">
            {errorMessage}
          </div>
        </div>
      )}

      <div className="absolute bottom-36 left-0 right-0 flex justify-center">
        <div className="bg-yellow-500/30 text-yellow-100 px-4 py-2 rounded-md text-sm font-medium">
          Ajuste o brilho se a imagem estiver escura
        </div>
      </div>
      
      {/* Debug info overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
        Face: {faceDetected ? "Detected" : "Not detected"} | Mode: {facingMode}
      </div>
    </div>
  );
};

export default CameraPreview;
