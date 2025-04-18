
import React from "react";
import { Button } from "@/components/ui/button";

interface IntroSectionProps {
  onStartCamera: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartCamera }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="mb-6 text-center">
        <p className="text-gray-600 mb-1">Tire uma foto para se conectar</p>
        <p className="text-xs text-gray-400">Seja você mesmo, seja real</p>
      </div>
      <Button 
        onClick={onStartCamera}
        className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md"
      >
        Iniciar Câmera
      </Button>
    </div>
  );
};

export default IntroSection;
