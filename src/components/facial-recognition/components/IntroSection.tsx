
import React from "react";
import { Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface IntroSectionProps {
  onStartCamera: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartCamera }) => {
  const handleActivateCamera = () => {
    console.log("Ativando câmera...");
    toast.info("Inicializando câmera...");
    onStartCamera();
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-6 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 shadow-inner min-h-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Busca por Foto
        </h3>
        <p className="text-gray-600 max-w-xs mx-auto">
          Tire uma foto de alguém para encontrá-lo no RealYou e conectar-se
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-75 blur-sm"></div>
        <motion.button
          className="relative bg-white text-purple-600 rounded-full p-8 shadow-lg"
          onClick={handleActivateCamera}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <Camera className="h-12 w-12" />
        </motion.button>
      </div>
      
      <Button 
        onClick={handleActivateCamera}
        className="font-medium text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity w-full max-w-xs py-6"
      >
        Ativar Câmera
      </Button>
      
      <div className="flex items-center text-sm text-gray-600 p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm">
        <Info className="h-4 w-4 mr-2 flex-shrink-0" />
        <p>
          Sua câmera será ativada em modo traseiro para capturar uma foto. Permita o acesso quando solicitado.
        </p>
      </div>
    </motion.div>
  );
};

export default IntroSection;
