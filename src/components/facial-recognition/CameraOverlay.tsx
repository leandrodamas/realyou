
import React from "react";
import { motion } from "framer-motion";

interface CameraOverlayProps {
  faceDetected: boolean;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ faceDetected }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10">
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
        />
      )}
    </div>
  );
};

export default CameraOverlay;
