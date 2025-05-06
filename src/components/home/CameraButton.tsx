
import React from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CameraButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCameraClick = () => {
    try {
      // Navegar para a página de reconhecimento facial em vez de registro
      navigate("/facial-recognition");
      toast.info("Abrindo reconhecimento facial...");
    } catch (error) {
      console.error("Erro na navegação:", error);
      toast.error("Não foi possível abrir a câmera");
    }
  };

  return (
    <motion.div 
      className="fixed bottom-24 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <button 
        className="rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 p-3.5 shadow-lg border-4 border-white"
        onClick={handleCameraClick}
        aria-label="Reconhecimento Facial"
      >
        <Camera className="h-8 w-8 text-white" />
      </button>
    </motion.div>
  );
};

export default CameraButton;
