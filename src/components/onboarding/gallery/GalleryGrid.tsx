
import React from "react";
import { Trash2 } from "lucide-react";
import { GalleryGridProps } from "./types";

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {images.map(img => (
        <div key={img.id} className="relative group">
          <img 
            src={img.preview} 
            className="w-full h-24 object-cover rounded-md" 
            alt="Preview"
          />
          <button
            onClick={() => onRemoveImage(img.id)}
            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-3 w-3 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
