
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";

export const useImageUploader = () => {
  const { uploadFile } = useFileUpload();
  
  /**
   * Upload a profile image to storage and return the public URL
   */
  const uploadProfileImage = async (
    imageData: string, 
    userId: string, 
    purpose: string
  ): Promise<string | null> => {
    try {
      // Convert Base64 to File
      const byteString = atob(imageData.split(',')[1]);
      const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const fileName = `${purpose}_${Date.now()}.jpg`;
      const imageFile = new File([blob], fileName, { type: mimeString });
      
      // Upload to appropriate bucket based on purpose
      const bucketName = purpose === 'face_registration' ? 'facial_recognition' : 'profile_images';
      
      // Upload image to storage
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName,
        folder: userId,
        metadata: {
          user_id: userId,
          purpose
        }
      });
      
      if (error || !publicUrl) {
        throw error;
      }
      
      return publicUrl;
    } catch (error) {
      console.error(`Erro ao enviar imagem (${purpose}):`, error);
      return null;
    }
  };
  
  return { uploadProfileImage };
};
