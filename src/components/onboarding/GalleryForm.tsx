
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import GalleryInfoBox from "./gallery/GalleryInfoBox";
import GalleryGrid from "./gallery/GalleryGrid";
import GalleryUploadZone from "./gallery/GalleryUploadZone";
import { GalleryImage } from "./gallery/types";

interface GalleryFormProps {
  onComplete: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ onComplete }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(2, 11),
        preview: URL.createObjectURL(file)
      }));
      
      setImages([...images, ...newImages]);
      setUploading(false);
      
      if (newImages.length > 0) {
        toast.success(`${newImages.length} imagens adicionadas`);
      }
    }, 1000);
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    toast.info("Imagem removida");
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Galeria de Trabalhos</h3>
      
      <GalleryInfoBox />
      
      <GalleryGrid images={images} onRemoveImage={removeImage} />
      
      <GalleryUploadZone onUpload={handleImageUpload} isUploading={uploading} />
      
      <div className="pt-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={onComplete}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GalleryForm;
