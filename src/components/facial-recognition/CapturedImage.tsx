
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface CapturedImageProps {
  imageData: string;
  onRetake: () => void;
  onConfirm: () => void;
}

const CapturedImage: React.FC<CapturedImageProps> = ({
  imageData,
  onRetake,
  onConfirm
}) => {
  return (
    <div className="relative bg-black rounded-lg overflow-hidden h-[400px]">
      <img
        src={imageData}
        alt="Captured face"
        className="h-full w-full object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full border-white/50 bg-black/30 text-white hover:bg-black/50 hover:text-white"
            onClick={onRetake}
          >
            <X className="h-5 w-5 mr-1" />
            Tentar novamente
          </Button>
          
          <Button 
            size="lg"
            className="rounded-full bg-green-500 hover:bg-green-600"
            onClick={onConfirm}
          >
            <Check className="h-5 w-5 mr-1" />
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CapturedImage;
