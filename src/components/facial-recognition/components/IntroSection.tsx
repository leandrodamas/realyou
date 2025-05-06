
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, User } from "lucide-react";
import { motion } from "framer-motion";

interface IntroSectionProps {
  onStartCamera: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({ onStartCamera }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-6">
      <motion.div 
        className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <User className="h-12 w-12 text-purple-600" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Encontre pessoas no RealYou</h2>
        <p className="text-gray-600 text-sm max-w-xs mx-auto">
          Utilize o reconhecimento facial para encontrar pessoas cadastradas com características faciais semelhantes
        </p>
      </div>

      <Button 
        onClick={onStartCamera}
        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 rounded-xl px-8 py-6 flex items-center gap-2"
      >
        <Camera className="h-5 w-5" />
        <span>Ativar câmera</span>
      </Button>

      <p className="text-xs text-gray-500 max-w-xs">
        Precisamos de acesso à sua câmera. Permita o acesso quando solicitado pelo seu navegador.
      </p>
    </div>
  );
};

export default IntroSection;
