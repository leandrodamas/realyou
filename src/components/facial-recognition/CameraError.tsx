
import React from "react";
import { Button } from "@/components/ui/button";
import { CameraOff } from "lucide-react";

interface CameraErrorProps {
  onReset: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ onReset }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
      <CameraOff className="h-12 w-12 text-white/60 mb-3" />
      <p className="text-white text-center px-6">Não foi possível acessar sua câmera</p>
      <p className="text-white/70 text-sm mt-1 text-center px-6">Verifique suas permissões de câmera</p>
      <Button 
        variant="outline" 
        className="mt-4 bg-white text-gray-800" 
        onClick={onReset}
      >
        Voltar
      </Button>
    </div>
  );
};

export default CameraError;
