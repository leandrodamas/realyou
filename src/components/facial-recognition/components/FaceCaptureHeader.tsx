
import React from "react";
import { Sparkles } from "lucide-react";

interface FaceCaptureHeaderProps {
  isRegistrationMode: boolean;
}

const FaceCaptureHeader: React.FC<FaceCaptureHeaderProps> = ({ isRegistrationMode }) => {
  if (isRegistrationMode) {
    return null;
  }
  
  return (
    <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
      <Sparkles className="h-5 w-5 text-purple-500" />
      <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Encontre conexões com fotos
      </span>
      <Sparkles className="h-5 w-5 text-blue-500" />
    </h2>
  );
};

export default FaceCaptureHeader;
