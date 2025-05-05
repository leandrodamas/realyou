
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface CoverImageSectionProps {
  coverImage?: string;
  isOwner: boolean;
  onCoverPhotoUpload: () => void;
  coverInputRef: React.RefObject<HTMLInputElement>;
  onCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  coverImage,
  isOwner,
  onCoverPhotoUpload,
  coverInputRef,
  onCoverImageChange
}) => {
  return (
    <div className="relative">
      <div 
        className="h-32 rounded-xl bg-cover bg-center"
        style={{ 
          backgroundImage: coverImage ? `url(${coverImage})` : 'linear-gradient(to right, #9333ea, #3b82f6)'
        }}
      >
        {isOwner && (
          <input 
            type="file"
            ref={coverInputRef}
            onChange={onCoverImageChange}
            className="hidden"
            accept="image/*"
          />
        )}
      </div>
      
      {isOwner && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-2 right-2 rounded-full"
          onClick={onCoverPhotoUpload}
        >
          <Camera className="h-4 w-4 mr-1" />
          Capa
        </Button>
      )}
    </div>
  );
};

export default CoverImageSection;
