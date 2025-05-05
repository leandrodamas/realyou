
import { useState } from "react";
import { toast } from "sonner";
import { compressImage } from "./utils/imageCompression";
import { generateUniqueFilename } from "./utils/fileNaming";
import { performFileUpload, getPublicUrl, deleteFile as deleteStorageFile } from "./utils/uploadOperations";
import { UploadOptions, FileUploadResult, FileUploadState } from "./types";

export const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0
  });

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<FileUploadResult> => {
    setState({ isUploading: true, uploadProgress: 0 });
    
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
      
      // Show progress update
      setState(prev => ({ ...prev, uploadProgress: 30 }));
      
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
      
      setState(prev => ({ ...prev, uploadProgress: 70 }));
      
      if (!data) {
        throw new Error("Upload failed without error details");
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get public URL
      const publicUrl = getPublicUrl(options.bucketName, filePath);

      console.log("Public URL obtained:", publicUrl);
      toast.success("Arquivo enviado com sucesso!");
      
      setState(prev => ({ ...prev, uploadProgress: 100 }));
      
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
      setState({ isUploading: false, uploadProgress: 100 });
    }
  };

  const deleteFile = async (bucketName: string, filePath: string): Promise<boolean> => {
    try {
      const { error } = await deleteStorageFile(bucketName, filePath);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      toast.error('Não foi possível excluir o arquivo');
      return false;
    }
  };

  const { isUploading, uploadProgress } = state;

  return {
    uploadFile,
    deleteFile,
    isUploading,
    uploadProgress
  };
};
