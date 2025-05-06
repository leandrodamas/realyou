
import React from "react";
import { motion } from "framer-motion";

interface CameraOverlayProps {
  faceDetected: boolean;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ faceDetected }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative h-full w-full">
        {/* Border overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Top Left */}
            <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-white opacity-70"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-white opacity-70"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white opacity-70"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white opacity-70"></div>

            {/* Detection feedback */}
            {faceDetected && (
              <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border-2 border-green-400 rounded-md"
              ></motion.div>
            )}

            {/* Scanning animation */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ 
                y: ["100%", "-100%"], 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "linear",
              }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;
