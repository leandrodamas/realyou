
import React from "react";
import { Button } from "@/components/ui/button";
import { CameraOff, RefreshCw, Settings } from "lucide-react";

interface CameraErrorProps {
  onReset: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ onReset }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
      <CameraOff className="h-12 w-12 text-white/60 mb-3" />
      <h3 className="text-white font-medium mb-1">Câmera não disponível</h3>
      <p className="text-white/70 text-sm mt-1 text-center px-6 mb-6">
        Verifique se você deu permissão para a câmera nas configurações do seu dispositivo
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20" 
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
        
        {navigator.userAgent.match(/Android/i) && (
          <a href="https://support.google.com/android/answer/9431959" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Verificar permissões no Android
            </Button>
          </a>
        )}
        
        {navigator.userAgent.match(/iPhone|iPad|iPod/i) && (
          <a href="https://support.apple.com/pt-br/HT211868" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Verificar permissões no iOS
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default CameraError;
