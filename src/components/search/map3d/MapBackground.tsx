
import React from "react";
import { motion } from "framer-motion";

const MapBackground: React.FC = () => {
  return (
    <>
      {/* Background do mapa com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-purple-100"></div>
      
      {/* Linhas de grade para efeito 3D */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
        {Array(36).fill(0).map((_, i) => (
          <div key={i} className="border border-blue-200/20"></div>
        ))}
      </div>
      
      {/* Placeholder de prédios 3D */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <div className="flex justify-around items-end h-full">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-sm"
              style={{ 
                height: `${Math.random() * 70 + 30}%`,
                width: `${Math.random() * 10 + 5}%`
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MapBackground;
