
import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CameraButton: React.FC = () => {
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);
  
  const handleCameraClick = async () => {
    try {
      setIsActivating(true);
      
      // Mobile device detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      console.log("Requesting camera access...");
      console.log("Device is mobile:", isMobile);
      
      // Use ideal:environment camera setting for mobile devices
      const constraints = isMobile 
        ? { video: { facingMode: { exact: "environment" } }, audio: false }
        : { video: { facingMode: "environment" }, audio: false };
        
      try {
        toast.info("Acessando câmera...");
        await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Camera permission granted successfully (environment camera)");
      } catch (err) {
        console.warn("Could not access environment camera:", err);
        
        // Fallback logic - try user-facing camera
        try {
          await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          console.log("Camera permission granted successfully (any camera)");
        } catch (innerErr) {
          console.error("Failed to access any camera:", innerErr);
          toast.error("Não foi possível acessar nenhuma câmera do dispositivo");
          setIsActivating(false);
          return;
        }
      }
      
      // Device-specific handling
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        toast.info("Em dispositivos iOS, você pode precisar permitir acesso à câmera nas configurações");
      } else if (/Android/i.test(navigator.userAgent)) {
        toast.info("Ao abrir a câmera, permita acesso quando solicitado");
      }
      
      // Navigate to facial recognition page
      navigate("/facial-recognition");
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      toast.error("Não foi possível acessar a câmera. Verifique suas permissões.");
    } finally {
      setIsActivating(false);
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
        className={`rounded-full flex items-center justify-center ${
          isActivating ? "bg-gray-500" : "bg-gradient-to-r from-purple-600 to-blue-500"
        } p-3.5 shadow-lg border-4 border-white`}
        onClick={handleCameraClick}
        aria-label="Reconhecimento Facial"
        disabled={isActivating}
      >
        {isActivating ? (
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
          </div>
        ) : (
          <Camera className="h-8 w-8 text-white" />
        )}
      </button>
    </motion.div>
  );
};

export default CameraButton;
