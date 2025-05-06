
import React from "react";
import { Loader2 } from "lucide-react";

interface CameraLoadingProps {
  loadingProgress?: number;
}

const CameraLoading: React.FC<CameraLoadingProps> = ({ loadingProgress = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg p-6 h-[400px] space-y-5">
      <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
      
      <div className="space-y-2 text-center">
        <p className="text-lg">Iniciando câmera...</p>
        <p className="text-sm text-gray-400">Por favor aguarde</p>
      </div>
      
      {loadingProgress > 0 && (
        <div className="w-48 bg-gray-700 rounded-full h-1.5 mt-4">
          <div 
            className="bg-blue-500 h-1.5 rounded-full" 
            style={{ width: `${loadingProgress}%` }} 
          ></div>
        </div>
      )}
    </div>
  );
};

export default CameraLoading;
