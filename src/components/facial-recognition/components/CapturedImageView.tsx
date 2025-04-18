
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CapturedImageViewProps {
  imageUrl: string;
  onReset: () => void;
}

const CapturedImageView: React.FC<CapturedImageViewProps> = ({ imageUrl, onReset }) => {
  return (
    <div className="relative w-full h-[75vh]">
      <img 
        src={imageUrl} 
        alt="Captured face" 
        className="w-full h-full object-cover rounded-2xl"
      />
      <Button 
        variant="destructive" 
        size="icon"
        className="absolute top-3 right-3 rounded-full shadow-md"
        onClick={onReset}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CapturedImageView;
