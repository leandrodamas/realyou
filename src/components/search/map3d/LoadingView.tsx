
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingView: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 p-6">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
      <p className="text-blue-500">Carregando mapa 3D...</p>
    </div>
  );
};

export default LoadingView;
