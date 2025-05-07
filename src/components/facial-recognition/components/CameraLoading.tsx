
import React, { useEffect, useState } from "react";
import { Loader2, Camera } from "lucide-react";

interface CameraLoadingProps {
  loadingProgress?: number;
}

const CameraLoading: React.FC<CameraLoadingProps> = ({ loadingProgress = 0 }) => {
  const [message, setMessage] = useState("Iniciando câmera...");
  const [timer, setTimer] = useState(0);
  
  // Show different messages based on how long it's taking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (timer > 8) {
      setMessage("Ainda tentando iniciar a câmera...");
    } else if (timer > 5) {
      setMessage("Verificando permissões de câmera...");
    }
  }, [timer]);
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg p-6 h-[400px] space-y-5">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
        <Camera className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-lg">{message}</p>
        <p className="text-sm text-gray-400">
          {timer < 10 ? "Por favor aguarde" : "Verifique se permitiu acesso à câmera"}
        </p>
      </div>
      
      <div className="w-48 bg-gray-700 rounded-full h-1.5 mt-4">
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${loadingProgress || Math.min(timer * 10, 95)}%` }} 
        ></div>
      </div>
      
      {timer > 12 && (
        <p className="text-xs text-yellow-300 mt-4 max-w-xs text-center">
          Se a câmera não iniciar em alguns segundos, tente recarregar a página ou verificar as permissões do navegador
        </p>
      )}
    </div>
  );
};

export default CameraLoading;
