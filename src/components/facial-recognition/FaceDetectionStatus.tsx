
import React from "react";
import { Move, CheckCircle2 } from "lucide-react";

interface FaceDetectionStatusProps {
  faceDetected: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({ faceDetected }) => {
  return (
    <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
      <div className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-lg ${
        faceDetected 
          ? "bg-green-500/90 text-white" 
          : "bg-yellow-500/90 text-white"
      }`}>
        {faceDetected ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Rosto detectado
          </>
        ) : (
          <>
            <Move className="h-4 w-4 animate-pulse" />
            Centralize seu rosto
          </>
        )}
      </div>
    </div>
  );
};

export default FaceDetectionStatus;
