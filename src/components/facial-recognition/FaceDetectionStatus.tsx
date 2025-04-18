
import React from "react";
import { Move } from "lucide-react";

interface FaceDetectionStatusProps {
  faceDetected: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({ faceDetected }) => {
  return (
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
  );
};

export default FaceDetectionStatus;
