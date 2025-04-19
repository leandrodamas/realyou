
import React from "react";
import { Camera, CheckCircle2 } from "lucide-react";

interface FaceDetectionStatusProps {
  faceDetected: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({ faceDetected }) => {
  return (
    <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
      <div className={`px-4 py-2 rounded-full text-base flex items-center gap-2 shadow-xl ${
        faceDetected 
          ? "bg-green-500 text-white" 
          : "bg-yellow-500 text-white"
      }`}>
        {faceDetected ? (
          <>
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Pronto para capturar</span>
          </>
        ) : (
          <>
            <Camera className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Posicione para foto</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceDetectionStatus;
