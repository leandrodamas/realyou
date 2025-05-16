
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/file-upload";
import { toast } from "sonner";
import { syncProfileWithSupabase, dispatchProfileUpdate, UserProfile } from "@/hooks/auth/profile";

// Default profile with required fields
export const DEFAULT_PROFILE: UserProfile = {
  id: '',
  userId: '',
  lastUpdated: new Date().toISOString(),
  profileImage: '',
  fullName: '',
  basePrice: 180,
  currency: 'BRL',
  title: 'Serviço Profissional'
};

export const useProfileStorage = () => {
  const { user } = useAuth();
  const { uploadFile, deleteFile } = useFileUpload();

  const getProfile = (): UserProfile | null => {
    try {
      // First try to get from local storage (temporary solution)
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  };
  
  const saveProfile = (profile: Partial<UserProfile>): boolean => {
    try {
      const currentUserId = user?.id;
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }
      
      // First get existing profile
      const savedProfile = localStorage.getItem('userProfile');
      const existingProfile: UserProfile = savedProfile 
        ? JSON.parse(savedProfile) 
        : { 
            id: currentUserId, 
            userId: currentUserId, 
            lastUpdated: new Date().toISOString() 
          };
        
      // Merge and save
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...profile,
        id: currentUserId,
        userId: currentUserId,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Dispatch the profile updated event
      dispatchProfileUpdate(updatedProfile);
      
      // Sync with Supabase in the background
      if (user) {
        syncProfileWithSupabase(currentUserId, updatedProfile)
          .then(success => {
            if (!success) {
              console.warn("Failed to sync profile with Supabase");
            }
          });
      }
      
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      return false;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error("Você precisa estar autenticado para fazer upload de imagens");
      return null;
    }

    try {
      const result = await uploadFile(file, {
        bucketName: 'profiles',
        folder: user.id,
        isPublic: true
      });

      if (result.error) throw result.error;
      
      // Update profile in Supabase
      if (result.publicUrl) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: result.publicUrl })
          .eq('id', user.id);
          
        if (updateError) {
          console.error("Error updating profile with new avatar:", updateError);
        }
      }
      
      return result.publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  };

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error("Você precisa estar autenticado para fazer upload de imagens");
      return null;
    }

    try {
      const result = await uploadFile(file, {
        bucketName: 'profiles',
        folder: `${user.id}/cover`,
        isPublic: true
      });

      if (result.error) throw result.error;
      return result.publicUrl;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Erro ao fazer upload da imagem de capa");
      return null;
    }
  };

  return { getProfile, saveProfile, uploadProfileImage, uploadCoverImage };
};
