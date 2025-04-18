
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadOptions {
  bucketName: string;
  folder?: string;
}

interface FileUploadResult {
  publicUrl: string | null;
  error: Error | null;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<FileUploadResult> => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Você precisa estar logado para fazer upload de arquivos");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = options.folder 
        ? `${options.folder}/${fileName}`
        : fileName;
      
      const { error: uploadError } = await supabase.storage
        .from(options.bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(options.bucketName)
        .getPublicUrl(filePath);

      return { publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { 
        publicUrl: null, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
};
