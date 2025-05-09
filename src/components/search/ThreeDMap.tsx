
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Professional } from "@/types/Professional";
import { MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

interface ThreeDMapProps {
  professionals: Professional[];
}

const ThreeDMap: React.FC<ThreeDMapProps> = ({ professionals }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth();

  // Update login state when user changes
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    // This is a placeholder for the 3D map
    console.log("Map initialized with professionals:", professionals);
    console.log("User logged in status:", isLoggedIn);
    
    // Refresh the component when login state changes
    const handleProfileLoaded = () => {
      console.log("Profile loaded, refreshing 3D map");
      if (mapContainerRef.current) {
        // Force refresh the map visualization
        const currentOpacity = mapContainerRef.current.style.opacity;
        mapContainerRef.current.style.opacity = "0";
        setTimeout(() => {
          if (mapContainerRef.current) {
            mapContainerRef.current.style.opacity = currentOpacity || "1";
          }
        }, 100);
      }
    };
    
    document.addEventListener('profileLoaded', handleProfileLoaded);
    
    // Cleanup function
    return () => {
      console.log("Map component unmounted");
      document.removeEventListener('profileLoaded', handleProfileLoaded);
    };
  }, [professionals, isLoggedIn]);

  const handleBecomeProfessional = () => {
    if (!isLoggedIn) {
      toast.info("Faça login para se tornar um profissional");
    } else {
      // Logic for registered users
      toast.info("Preparando seu cadastro profissional...");
    }
  };

  if (professionals.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MapIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
          <p className="text-gray-500 mb-6">Cadastre-se como profissional ou refine sua busca para encontrar profissionais na sua área</p>
          <Button onClick={handleBecomeProfessional}>Tornar-se Profissional</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full bg-blue-50 relative overflow-hidden transition-opacity duration-300"
    >
      {/* Background do mapa com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-purple-100"></div>
      
      {/* Elementos 3D mockados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full"
        >
          {/* Linhas de grade para efeito 3D */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array(36).fill(0).map((_, i) => (
              <div key={i} className="border border-blue-200/20"></div>
            ))}
          </div>
          
          {/* Marcadores de profissionais no mapa */}
          {professionals.map((pro) => {
            // Converter coordenadas geográficas para posição relativa na tela
            // Esta é uma posição mock simplificada
            const x = ((pro.coordinates[0] + 43.19) * 1000) % 100;
            const y = ((pro.coordinates[1] + 22.96) * 1000) % 100;
            
            return (
              <motion.div
                key={`${pro.id}`}
                className="absolute"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
              >
                <div className="bg-white p-1 rounded-full shadow-lg">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200">
                    <img 
                      src={pro.image || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                      alt={pro.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                {/* Efeito de pulso */}
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75"></div>
              </motion.div>
            );
          })}
        </motion.div>
        
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
      </div>
      
      {/* Login status indicator for debugging */}
      {isLoggedIn && (
        <div className="absolute left-4 bottom-4 bg-green-500/80 text-white px-2 py-1 rounded-md text-xs">
          Usuário logado ✓
        </div>
      )}
      
      {/* Controles do mapa */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
        <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
          </svg>
        </button>
      </div>
      
      {/* Marcador de localização do usuário */}
      <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="relative">
          <div className="h-4 w-4 bg-blue-600 border-2 border-white rounded-full"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
      
      {/* Overlay informativo */}
      <div className="absolute left-4 top-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
        <p className="text-gray-700">
          <span className="font-medium">3D</span> mapa interativo
        </p>
      </div>
    </div>
  );
};

export default ThreeDMap;
