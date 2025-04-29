
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface GalleryFormProps {
  onComplete: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ onComplete }) => {
  const [images, setImages] = useState<{ id: string; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
      
      <div className="bg-gray-50 border rounded-lg p-3 mb-3">
        <div className="flex items-center mb-2">
          <Image className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-medium">Mostre seu trabalho!</span>
        </div>
        <p className="text-sm text-gray-600">
          Adicione fotos dos seus melhores trabalhos para atrair mais clientes.
          Os perfis com galeria recebem até 3x mais visualizações.
        </p>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {images.map(img => (
            <div key={img.id} className="relative group">
              <img 
                src={img.preview} 
                className="w-full h-24 object-cover rounded-md" 
                alt="Preview"
              />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          id="gallery-upload" 
          className="hidden" 
          onChange={handleImageUpload}
          disabled={uploading}
        />
        <label 
          htmlFor="gallery-upload" 
          className="cursor-pointer flex flex-col items-center"
        >
          <div className="rounded-full bg-purple-100 p-3 mb-2">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            {uploading ? "Enviando..." : "Arraste imagens ou clique aqui"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Formatos suportados: JPG, PNG, GIF
          </p>
        </label>
      </div>
      
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
