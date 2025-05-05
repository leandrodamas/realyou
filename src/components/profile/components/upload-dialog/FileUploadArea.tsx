
import React from "react";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploadAreaProps } from "./types";

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  selectedFile,
  previewUrl,
  fileInputRef,
  isUploading,
  uploadProgress,
  onFileSelect,
  onRemove
}) => {
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
        disabled={isUploading}
      />
      
      {previewUrl && (
        <div className="mb-4 relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md" 
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemove}
            disabled={isUploading}
          >
            Remover
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        {selectedFile && !previewUrl && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>{selectedFile.name}</span>
          </div>
        )}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? "Trocar Imagem" : "Selecionar Imagem"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
