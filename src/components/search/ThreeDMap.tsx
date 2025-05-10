
import React from "react";
import { motion } from "framer-motion";
import { Professional } from "@/types/Professional";
import MapBackground from "./map3d/MapBackground";
import MapControls from "./map3d/MapControls";
import MapInfoOverlay from "./map3d/MapInfoOverlay";
import ProfessionalMarker from "./map3d/ProfessionalMarker";
import EmptyStateView from "./map3d/EmptyStateView";
import LoadingView from "./map3d/LoadingView";
import { use3DMap } from "./map3d/use3DMap";

interface ThreeDMapProps {
  professionals: Professional[];
}

const ThreeDMap: React.FC<ThreeDMapProps> = ({ professionals }) => {
  const { isLoading, isLoggedIn, handleBecomeProfessional } = use3DMap(professionals);

  if (isLoading) {
    return <LoadingView />;
  }

  if (professionals.length === 0) {
    return <EmptyStateView onBecomeProfessional={handleBecomeProfessional} />;
  }

  return (
    <div 
      className="w-full h-full bg-blue-50 relative overflow-hidden transition-opacity duration-300"
    >
      <MapBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Marcadores de profissionais no mapa com loading progressivo */}
        {professionals.map((pro, index) => (
          <ProfessionalMarker 
            key={pro.id} 
            professional={pro} 
            index={index} 
          />
        ))}
      </motion.div>
      
      <MapControls />
      <MapInfoOverlay isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default ThreeDMap;
