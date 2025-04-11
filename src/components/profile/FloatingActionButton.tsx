
import React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FloatingActionButton: React.FC = () => {
  return (
    <motion.div 
      className="fixed bottom-24 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Button 
        className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
        onClick={() => toast.info("Opening camera...")}
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;
