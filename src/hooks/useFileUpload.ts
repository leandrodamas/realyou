
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadOptions {
  bucketName: string;
  folder?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
  anonymous?: boolean;
}

interface FileUploadResult {
  publicUrl: string | null;
  filePath: string | null;
  error: Error | null;
}

/**
 * Compresses an image file to reduce its size
 */
const compressImage = (file: File, quality: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Resize if the image is too large
        let width = img.width;
        let height = img.height;
        const maxSize = 1200; // Max size in pixels
        
        if (width > height && width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generates a unique filename to avoid collisions
 */
const generateUniqueFilename = (file: File): string => {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}.${fileExt}`;
};

/**
 * Performs the actual file upload to Supabase storage
 */
const performFileUpload = async (
  file: File,
  filePath: string,
  bucketName: string,
  metadata: Record<string, string>
): Promise<{ error: Error | null; data: any }> => {
  console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);
  console.log(`File type: ${file.type}, size: ${file.size} bytes`);
  
  // Upload options without upsert to avoid RLS conflicts
  const uploadOptions = {
    cacheControl: '3600',
    contentType: file.type,
    metadata
  };
  
  // Upload the file
  const { error, data } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, uploadOptions);
    
  return { error, data };
};

/**
 * Gets the public URL of an uploaded file
 */
const getPublicUrl = (bucketName: string, filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return publicUrl;
};

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<FileUploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Generate a unique filename
      const fileName = generateUniqueFilename(file);
      const filePath = options.folder 
        ? `${options.folder}/${fileName}`
        : fileName;
      
      // Prepare metadata
      const metadata = {
        contentType: file.type,
        fileSize: file.size.toString(),
        ...options.metadata
      };
      
      // Compression of image if needed
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.size > 500000) { // 500KB
        fileToUpload = await compressImage(file, 0.8);
        console.log(`Imagem comprimida: ${file.size} -> ${fileToUpload.size}`);
      }
      
      // Perform the upload
      const { error: uploadError, data } = await performFileUpload(
        fileToUpload, 
        filePath, 
        options.bucketName, 
        metadata
      );

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }
      
      if (!data) {
        throw new Error("Upload failed without error details");
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get public URL
      const publicUrl = getPublicUrl(options.bucketName, filePath);

      console.log("Public URL obtained:", publicUrl);
      toast.success("Arquivo enviado com sucesso!");
      
      return { publicUrl, filePath, error: null };
      
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Não foi possível enviar o arquivo. Tente novamente.');
      return { 
        publicUrl: null,
        filePath: null,
        error: error instanceof Error ? error : new Error('Erro desconhecido') 
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const deleteFile = async (bucketName: string, filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      toast.error('Não foi possível excluir o arquivo');
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    uploadProgress
  };
};
