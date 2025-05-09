
import React from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CameraButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCameraClick = async () => {
    try {
      // Request camera permission explicitly before navigating
      try {
        await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: "environment" } 
          }, 
          audio: false 
        });
        console.log("Camera permission granted successfully");
      } catch (err) {
        console.warn("Could not get environment camera, trying any camera:", err);
        // Try again with just any camera
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      
      // Navigate to facial recognition page
      navigate("/facial-recognition");
      toast.info("Abrindo reconhecimento facial...");
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      toast.error("Não foi possível acessar a câmera. Verifique suas permissões.");
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
