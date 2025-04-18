
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
              <ellipse cx="50%" cy="50%" rx="35%" ry="45%" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="black" mask="url(#oval-mask)" fillOpacity="0.5" />
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ 
          opacity: faceDetected ? 0.9 : 0.6,
          borderColor: faceDetected ? "rgb(74, 222, 128)" : "rgba(255, 255, 255, 0.5)" 
        }}
        transition={{ duration: 0.2 }}
        className={`absolute border-2 rounded-full ${faceDetected ? "border-green-400" : "border-white/50"}`}
        style={{
          width: "70%",
          height: "90%",
          boxShadow: faceDetected 
            ? "0 0 0 4px rgba(74, 222, 128, 0.3), 0 0 12px rgba(74, 222, 128, 0.5)"
            : "0 0 0 2px rgba(255, 255, 255, 0.2)"
        }}
      />
      
      {faceDetected && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute z-20 text-green-400 text-xs font-medium"
          style={{ bottom: "38%" }}
        >
          Rosto detectado com sucesso
        </motion.div>
      )}
    </div>
  );
};

export default CameraOverlay;
