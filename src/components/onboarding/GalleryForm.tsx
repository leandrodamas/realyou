
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GalleryUploadZone from "./gallery/GalleryUploadZone";
import GalleryGrid from "./gallery/GalleryGrid";
import GalleryInfoBox from "./gallery/GalleryInfoBox";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GalleryImage {
  id: string;
  preview: string;
  file: File;
}

interface GalleryFormProps {
  onComplete: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ onComplete }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { uploadFile } = useFileUpload();
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
      } catch (error) {
        console.error("Error checking user session:", error);
      }
    };
    
    checkUser();
    
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).map(file => {
      const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = URL.createObjectURL(file);
      
      return { id, preview, file };
    });
    
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleCompleteSection = async () => {
    if (images.length === 0) {
      onComplete();
      return;
    }
    
    // Ensure user is logged in
    if (!userId) {
      toast.error("Você precisa estar logado para salvar seus trabalhos");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload each image
      for (const image of images) {
        const title = `Trabalho ${new Date().toLocaleDateString()}`;
        
        // Upload image to storage
        const { publicUrl, error: uploadError } = await uploadFile(image.file, {
          bucketName: 'work_gallery',
          folder: userId,
          metadata: {
            title,
            user_id: userId
          }
        });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Save to database
        const { error: dbError } = await supabase
          .from('work_gallery')
          .insert({
            title,
            image_path: publicUrl,
            user_id: userId
          });
          
        if (dbError) {
          throw dbError;
        }
      }
      
      toast.success("Galeria salva com sucesso!");
      onComplete();
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast.error("Erro ao salvar sua galeria");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <GalleryInfoBox />
      
      <GalleryUploadZone onUpload={handleUpload} isUploading={isUploading} />
      
      <GalleryGrid images={images} onRemoveImage={handleRemoveImage} />
      
      <Button 
        onClick={handleCompleteSection}
        className="w-full"
        disabled={isUploading}
      >
        {images.length > 0 ? "Salvar e Continuar" : "Pular por Enquanto"}
      </Button>
    </div>
  );
};

export default GalleryForm;
