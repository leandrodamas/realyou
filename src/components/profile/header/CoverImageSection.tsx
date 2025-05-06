
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverImageSectionProps {
  coverImage?: string;
  isOwner: boolean;
  onCoverPhotoUpload: () => void;
  coverInputRef: React.RefObject<HTMLInputElement>;
  onCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading?: boolean;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  coverImage,
  isOwner,
  onCoverPhotoUpload,
  coverInputRef,
  onCoverImageChange,
  isUploading = false
}) => {
  return (
    <div className="relative">
      <div 
        className="h-32 rounded-xl bg-cover bg-center transition-all duration-500 ease-in-out relative overflow-hidden"
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
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {isOwner && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-2 right-2 rounded-full"
          onClick={onCoverPhotoUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Camera className="h-4 w-4 mr-1" />
          )}
          Capa
        </Button>
      )}
    </div>
  );
};

export default CoverImageSection;
