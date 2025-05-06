
import React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    navigate("/facial-recognition");
    toast.info("Abrindo reconhecimento facial...");
  };

  return (
    <motion.div 
      className="fixed bottom-24 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Button 
        className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
        onClick={handleCameraClick}
        aria-label="Reconhecimento Facial"
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;
