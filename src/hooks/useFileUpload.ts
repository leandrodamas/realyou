
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadOptions {
  bucketName: string;
  folder?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

interface FileUploadResult {
  publicUrl: string | null;
  filePath: string | null;
  error: Error | null;
}

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
      // Verificar se usuário está logado (para adicionar metadata)
      const { data: { user } } = await supabase.auth.getUser();
      const metadata = {
        contentType: file.type,
        size: file.size.toString(),
        ...(user ? { user_id: user.id } : {}),
        ...options.metadata
      };
      
      // Gerar nome de arquivo único para evitar colisões
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = options.folder 
        ? `${options.folder}/${fileName}`
        : fileName;
      
      // Compressão de imagem se for um arquivo de imagem
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.size > 500000) { // 500KB
        fileToUpload = await compressImage(file, 0.8);
        console.log(`Imagem comprimida: ${file.size} -> ${fileToUpload.size}`);
      }
      
      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from(options.bucketName)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata
        });

      if (uploadError) throw uploadError;
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucketName)
        .getPublicUrl(filePath);

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

  // Função para comprimir imagens
  const compressImage = (file: File, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Redimensionar se a imagem for muito grande
          let width = img.width;
          let height = img.height;
          const maxSize = 1200; // Tamanho máximo em pixels
          
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
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Falha na compressão da imagem'));
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
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Função para deletar arquivos
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
