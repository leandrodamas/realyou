
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Image } from "lucide-react";

interface CapturedImageViewProps {
  imageUrl: string;
  onReset: () => void;
}

const CapturedImageView: React.FC<CapturedImageViewProps> = ({ 
  imageUrl, 
  onReset 
}) => {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="relative rounded-lg overflow-hidden bg-black shadow-inner w-full h-[400px]">
        <div className="absolute top-0 right-0 bg-black/50 px-3 py-1.5 rounded-bl-lg">
          <div className="flex items-center gap-1.5">
            <Image className="h-4 w-4 text-white" />
            <span className="text-white text-xs font-medium">Capturado</span>
          </div>
        </div>
        
        <img 
          src={imageUrl} 
          alt="Imagem capturada" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full">
        <Button 
          onClick={onReset}
          variant="outline" 
          className="flex items-center gap-2 w-full"
        >
          <RefreshCcw className="h-4 w-4" />
          Tirar outra foto
        </Button>
      </div>
    </div>
  );
};

export default CapturedImageView;
