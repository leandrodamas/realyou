
import React from "react";

interface MapInfoOverlayProps {
  isLoggedIn: boolean;
}

const MapInfoOverlay: React.FC<MapInfoOverlayProps> = ({ isLoggedIn }) => {
  return (
    <>
      {/* Login status indicator */}
      {isLoggedIn ? (
        <div className="absolute left-4 bottom-4 bg-green-500/80 text-white px-2 py-1 rounded-md text-xs">
          Usuário logado ✓
        </div>
      ) : (
        <div className="absolute left-4 bottom-4 bg-yellow-500/80 text-white px-2 py-1 rounded-md text-xs">
          Faça login para ver mais profissionais
        </div>
      )}
      
      {/* Overlay informativo */}
      <div className="absolute left-4 top-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs">
        <p className="text-gray-700">
          <span className="font-medium">3D</span> mapa interativo
        </p>
      </div>
      
      {/* Marcador de localização do usuário */}
      <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="relative">
          <div className="h-4 w-4 bg-blue-600 border-2 border-white rounded-full"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
    </>
  );
};

export default MapInfoOverlay;
