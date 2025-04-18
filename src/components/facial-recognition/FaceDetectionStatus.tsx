
import React from "react";
import { Move, CheckCircle2 } from "lucide-react";

interface FaceDetectionStatusProps {
  faceDetected: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({ faceDetected }) => {
  return (
    <div className="absolute top-6 left-0 right-0 flex justify-center">
      <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 ${
        faceDetected 
          ? "bg-green-500/80 text-white" 
          : "bg-yellow-500/80 text-white"
      }`}>
        {faceDetected ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Rosto detectado
          </>
        ) : (
          <>
            <Move className="h-3.5 w-3.5 animate-pulse" />
            Centralize seu rosto
          </>
        )}
      </div>
    </div>
  );
};

export default FaceDetectionStatus;
