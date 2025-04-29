
import React, { useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { GalleryUploadZoneProps } from "./types";

const GalleryUploadZone: React.FC<GalleryUploadZoneProps> = ({ onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        id="gallery-upload" 
        className="hidden" 
        onChange={(e) => onUpload(e.target.files)}
        disabled={isUploading}
        ref={fileInputRef}
      />
      <label 
        htmlFor="gallery-upload" 
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="rounded-full bg-purple-100 p-3 mb-2">
          <Upload className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          {isUploading ? "Enviando..." : "Arraste imagens ou clique aqui"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Formatos suportados: JPG, PNG, GIF
        </p>
      </label>
    </div>
  );
};

export default GalleryUploadZone;
