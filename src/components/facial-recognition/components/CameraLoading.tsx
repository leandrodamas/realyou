
import React from "react";

interface CameraLoadingProps {
  loadingProgress: number;
}

const CameraLoading: React.FC<CameraLoadingProps> = ({ loadingProgress }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] bg-gray-900">
      <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
      <p className="text-white mb-4">Inicializando câmera...</p>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CameraLoading;
