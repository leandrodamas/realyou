
import React from "react";
import { motion } from "framer-motion";
import { Professional } from "@/types/Professional";

interface ProfessionalMarkerProps {
  professional: Professional;
  index: number;
}

const ProfessionalMarker: React.FC<ProfessionalMarkerProps> = ({ professional, index }) => {
  // Converter coordenadas geográficas para posição relativa na tela
  const x = ((professional.coordinates?.[0] || 0) + 43.19) % 100;
  const y = ((professional.coordinates?.[1] || 0) + 22.96) % 100;
  
  return (
    <motion.div
      key={`${professional.id}`}
      className="absolute"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="bg-white p-1 rounded-full shadow-lg">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200">
          <img 
            src={professional.image || "https://randomuser.me/api/portraits/lego/1.jpg"} 
            alt={professional.name}
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        </div>
      </div>
      {/* Efeito de pulso */}
      <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75"></div>
    </motion.div>
  );
};

export default ProfessionalMarker;
