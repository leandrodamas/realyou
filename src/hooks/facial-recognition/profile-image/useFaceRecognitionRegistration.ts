
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileImageRegistrationResult } from "./types";

/**
 * Hook for registering a face image with the facial recognition system
 */
export const useFaceRecognitionRegistration = () => {
  const { uploadFile } = useFileUpload();

  /**
   * Register a profile image with facial recognition
   */
  const registerProfileImageWithFaceID = async (imageData: string): Promise<ProfileImageRegistrationResult> => {
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
      const imageFile = new File([blob], "profile-with-faceid.jpg", { type: mimeString });
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para registrar seu reconhecimento facial");
        return { success: false, error: new Error("User not authenticated") };
      }
      
      // Upload to facial_recognition bucket
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'facial_recognition',
        folder: user.id,
        metadata: {
          user_id: user.id,
          purpose: 'facial_recognition'
        }
      });
      
      if (error || !publicUrl) {
        throw error;
      }
      
      toast.success("Reconhecimento facial registrado com sucesso!");
      return { success: true, imageUrl: publicUrl };
    } catch (error) {
      console.error('Erro ao registrar reconhecimento facial:', error);
      toast.error("Não foi possível registrar seu reconhecimento facial");
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  };

  return {
    registerProfileImageWithFaceID
  };
};
