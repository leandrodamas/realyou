
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

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
  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    
    if (errorType === 'NotAllowedError') {
      return "Acesso à câmera negado. Por favor, permita o acesso à câmera nas configurações do seu navegador.";
    } else if (errorType === 'NotFoundError') {
      return "Câmera não encontrada. Verifique se sua câmera está conectada e funcionando.";
    } else if (errorType === 'NotReadableError') {
      return "A câmera não pôde ser acessada. Ela pode estar sendo usada por outro aplicativo.";
    }
    
    return "Ocorreu um erro ao acessar a câmera. Por favor, tente novamente.";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col items-center">
      <div className="bg-red-100 rounded-full p-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      
      <h3 className="text-xl font-medium mt-4 mb-2 text-center">
        Erro na Câmera
      </h3>
      
      <p className="text-gray-600 text-center mb-4">
        {getErrorMessage()}
      </p>
      
      {retryCount > 0 && (
        <p className="text-sm text-orange-600 mb-4">
          {`Já tentamos ${retryCount} ${retryCount === 1 ? 'vez' : 'vezes'} sem sucesso.`}
        </p>
      )}
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        Se o problema persistir, tente reiniciar seu navegador ou dispositivo.
      </p>
    </div>
  );
};

export default CameraError;
