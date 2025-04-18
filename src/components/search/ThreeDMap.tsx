import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Professional {
  id: number;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  image: string;
  // other professional properties
}

interface ThreeDMapProps {
  professionals: Professional[];
}

const ThreeDMap: React.FC<ThreeDMapProps> = ({ professionals }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // This is a placeholder for actual 3D map implementation
    // In a real implementation, we would use three.js, mapbox-gl, or another mapping library
    
    console.log("Map initialized with professionals:", professionals);
    
    // Clean up function
    return () => {
      console.log("Map component unmounted");
    };
  }, [professionals]);

  // This is a placeholder component for demonstration
  // In a real implementation, this would render an actual 3D map
  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full bg-blue-50 relative overflow-hidden"
    >
      {/* Placeholder map background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-purple-100"></div>
      
      {/* Mock floating 3D elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full"
        >
          {/* Grid lines for 3D effect */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array(36).fill(0).map((_, i) => (
              <div key={i} className="border border-blue-200/20"></div>
            ))}
          </div>
          
          {/* Professional markers on the map */}
          {professionals.map((pro) => {
            // Convert geo coordinates to relative position on screen
            // This is a simplified mock positioning
            const x = ((pro.coordinates[0] + 43.19) * 1000) % 100;
            const y = ((pro.coordinates[1] + 22.96) * 1000) % 100;
            
            return (
              <motion.div
                key={pro.id}
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
                {/* Pulse effect */}
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75"></div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* 3D Buildings Placeholder */}
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
      
      {/* Map controls placeholder */}
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
      
      {/* User location marker */}
      <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="relative">
          <div className="h-4 w-4 bg-blue-600 border-2 border-white rounded-full"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
      
      {/* Informational overlay */}
      <div className="absolute left-4 top-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
        <p className="text-gray-700">
          <span className="font-medium">3D</span> mapa interativo
        </p>
      </div>
    </div>
  );
};

export default ThreeDMap;
