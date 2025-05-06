
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaceDetectionStatusProps {
  faceDetected: boolean;
}

const FaceDetectionStatus: React.FC<FaceDetectionStatusProps> = ({ faceDetected }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={faceDetected ? "detected" : "not-detected"}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-md"
        style={{
          background: faceDetected 
            ? "rgba(52, 211, 153, 0.9)"
            : "rgba(239, 68, 68, 0.9)",
        }}
      >
        <span className="text-white font-medium text-sm flex items-center">
          {faceDetected ? (
            <>
              <span className="h-2 w-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Rosto detectado
            </>
          ) : (
            <>
              <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
              Posicione seu rosto
            </>
          )}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default FaceDetectionStatus;
