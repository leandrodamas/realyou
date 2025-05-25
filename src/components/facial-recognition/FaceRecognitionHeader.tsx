
import React from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FaceRecognitionHeaderProps {
  showInfo: boolean;
  onToggleInfo: () => void;
}

const FaceRecognitionHeader: React.FC<FaceRecognitionHeaderProps> = ({
  showInfo,
  onToggleInfo,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md p-4 flex items-center border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <Link to="/" className="mr-4 rounded-full hover:bg-gray-100 p-2 transition-colors">
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Link>
      <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Busca por Foto
      </h1>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto flex items-center gap-1 text-gray-600"
        onClick={onToggleInfo}
      >
        <Info className="h-4 w-4" />
        {showInfo ? "Ocultar Info" : "Sobre"}
        {showInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </header>
  );
};

export default FaceRecognitionHeader;
