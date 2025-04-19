
import React from "react";
import { Button } from "@/components/ui/button";
import { CameraOff, RefreshCcw, Settings, AlertTriangle, X } from "lucide-react";

interface CameraErrorProps {
  onReset: () => void;
  errorMessage?: string | null;
  errorType?: string | null;
  retryCount?: number;
}

const CameraError: React.FC<CameraErrorProps> = ({ 
  onReset, 
  errorMessage, 
  errorType,
  retryCount = 0
}) => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent);
  const isFirefox = /Firefox/i.test(navigator.userAgent);
  const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
  
  // Determine if it's a mobile device for better tips
  const isMobile = isAndroid || isIOS;
  
  // Check if error is related to camera being in use
  const isCameraInUse = errorType === "NotReadableError" || 
    (errorMessage && (
      errorMessage.includes("already in use") || 
      errorMessage.includes("being used") ||
      errorMessage.includes("NotReadableError") ||
      errorMessage.includes("Could not start video source")
    ));

  // Check if max retries has been reached
  const isMaxRetriesReached = retryCount >= 3;
  
  // Handle complete page refresh
  const handleHardReset = () => {
    window.location.reload();
  };
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
      <CameraOff className="h-12 w-12 text-white/60 mb-3" />
      <h3 className="text-white font-medium mb-1">Câmera não disponível</h3>
      
      <div className="text-white/70 text-sm mt-1 text-center px-6 mb-6 space-y-2">
        {isCameraInUse ? (
          <p className="text-yellow-300 font-medium">
            A câmera está sendo usada por outro aplicativo
            {retryCount > 0 && ` (Tentativa ${retryCount}/3)`}
          </p>
        ) : (
          <p>Verifique se você deu permissão para a câmera nas configurações do seu dispositivo</p>
        )}
        
        {/* Specific instructions based on error type */}
        {isCameraInUse && (
          <div className="flex items-center justify-center gap-2 bg-yellow-500/20 p-2 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-300" />
            <p className="text-yellow-300 text-xs font-medium">
              Feche outros aplicativos ou guias do navegador que possam estar usando a câmera
            </p>
          </div>
        )}
        
        {isMaxRetriesReached && (
          <div className="flex items-center justify-center gap-2 bg-red-500/20 p-2 rounded-md mt-2">
            <X className="h-4 w-4 text-red-300" />
            <p className="text-red-300 text-xs font-medium">
              Várias tentativas de acesso falharam. Tente reiniciar a página ou o navegador.
            </p>
          </div>
        )}
        
        {isMobile && (
          <div className="flex items-center justify-center gap-2 bg-blue-500/20 p-2 rounded-md">
            <AlertTriangle className="h-4 w-4 text-blue-300" />
            <p className="text-blue-300 text-xs font-medium">
              Em dispositivos móveis, é necessário conceder permissão explícita para a câmera
            </p>
          </div>
        )}
        
        {/* Browser-specific tips */}
        {isChrome && (
          <p className="text-xs text-white/60">
            No Chrome, verifique o ícone da câmera na barra de endereço para gerenciar permissões
          </p>
        )}
        
        {isFirefox && (
          <p className="text-xs text-white/60">
            No Firefox, clique no ícone de cadeado na barra de endereço para gerenciar permissões
          </p>
        )}
        
        {isSafari && (
          <p className="text-xs text-white/60">
            No Safari, acesse Preferências &gt; Websites &gt; Câmera para gerenciar permissões
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white/20" 
          onClick={onReset}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
        
        {isMaxRetriesReached && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleHardReset}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reiniciar página completa
          </Button>
        )}
        
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
