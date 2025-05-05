
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfileImageState } from "./useProfileImageState";
import { ProfileImageRegistrationResult } from "./types";

/**
 * Hook for handling profile image upload operations
 */
export const useProfileImageUpload = () => {
  const { profileImage, isUploading, setProfileImage, setUploadingState } = useProfileImageState();
  const { uploadFile } = useFileUpload();

  /**
   * Upload a profile image to storage
   */
  const uploadProfileImage = async (imageFile: File): Promise<string | null> => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para enviar uma foto de perfil");
        return null;
      }
      
      // Set uploading state
      setUploadingState(true);
      
      // Upload image to the profile_images bucket
      const { publicUrl, error } = await uploadFile(imageFile, {
        bucketName: 'profile_images',
        folder: user.id,
        metadata: {
          user_id: user.id,
          purpose: 'profile_image'
        }
      });
      
      if (error || !publicUrl) {
        throw error;
      }
      
      // Update state with new image URL
      setProfileImage(publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Erro ao enviar foto de perfil:', error);
      toast.error("Não foi possível salvar sua foto de perfil");
      return null;
    } finally {
      setUploadingState(false);
    }
  };
  
  return {
    profileImage,
    isUploading,
    setProfileImage,
    uploadProfileImage
  };
};
