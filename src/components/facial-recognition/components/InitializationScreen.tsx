
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InitializationScreenProps {
  isInitializing: boolean;
  hasError: boolean;
  error?: string;
  onRetry: () => void;
}

const InitializationScreen: React.FC<InitializationScreenProps> = ({ 
  isInitializing, 
  hasError,
  error,
  onRetry 
}) => {
  useEffect(() => {
    console.log("InitializationScreen mounted", { isInitializing, hasError });
  }, [isInitializing, hasError]);

  if (!isInitializing && !hasError) {
    console.log("InitializationScreen: No initialization or error, returning null");
    return null;
  }
  
  if (hasError) {
    console.log("InitializationScreen: Rendering error state");
    return (
      <div className="flex flex-col items-center p-8 text-center">
        <div className="bg-red-50 rounded-lg p-6 max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Falha de inicialização</h3>
          <p className="text-gray-600 mb-4">
            {error || "Não foi possível inicializar os recursos de reconhecimento facial. Verifique sua conexão ou permissões do navegador."}
          </p>
          <Button
            onClick={(e) => {
              console.log("InitializationScreen: Retry button clicked", e);
              onRetry();
            }}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }
  
  console.log("InitializationScreen: Rendering initializing state");
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium">Inicializando reconhecimento facial</h3>
      <p className="text-sm text-gray-500 mt-2">
        Preparando recursos de reconhecimento facial...
      </p>
    </div>
  );
};

export default InitializationScreen;
