
import React from "react";
import { Button } from "@/components/ui/button";
import { CameraOff, RefreshCw, Settings, AlertTriangle } from "lucide-react";

interface CameraErrorProps {
  onReset: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ onReset }) => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Determinar se é um dispositivo mobile para melhorar dicas
  const isMobile = isAndroid || isIOS;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
      <CameraOff className="h-12 w-12 text-white/60 mb-3" />
      <h3 className="text-white font-medium mb-1">Câmera não disponível</h3>
      
      <div className="text-white/70 text-sm mt-1 text-center px-6 mb-6 space-y-2">
        <p>Verifique se você deu permissão para a câmera nas configurações do seu dispositivo</p>
        
        {isMobile && (
          <div className="flex items-center justify-center gap-2 bg-red-500/20 p-2 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-300" />
            <p className="text-red-300 text-xs font-medium">
              Em dispositivos móveis, é necessário conceder permissão explícita para a câmera
            </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20" 
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
        
        {isAndroid && (
          <a href="app-settings:" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Abrir configurações do app
            </Button>
          </a>
        )}
        
        {isIOS && (
          <div className="bg-white/10 p-3 rounded-md text-xs text-white/80">
            <p>No iOS, abra:</p>
            <p className="font-medium my-1">Configurações &gt; Privacidade &gt; Câmera</p>
            <p>e permita o acesso para este app</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraError;
