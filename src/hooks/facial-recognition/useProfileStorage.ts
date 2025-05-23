
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/file-upload";
import { UserProfile } from "@/hooks/auth/profile/types";
import { dispatchProfileUpdate } from "@/hooks/auth/profile";

// Default profile with required fields and common optional fields
export const DEFAULT_PROFILE: UserProfile = {
  userId: '',
  id: '',
  lastUpdated: new Date().toISOString(),
  profileImage: '',
  fullName: '',
  basePrice: 180,
  currency: 'BRL',
  title: 'Serviço Profissional'
};

export const useProfileStorage = () => {
  const { user } = useAuth();
  const { uploadFile } = useFileUpload();

  const saveProfile = (profileData: Partial<UserProfile>): void => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile: Partial<UserProfile> = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        ...profile as UserProfile,
        ...profileData,
        userId: profile.userId || user?.id || '', 
        id: profile.id || user?.id || '',
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Notify other components about the profile update
      dispatchProfileUpdate(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Não foi possível salvar informações do perfil");
    }
  };

  const getProfile = (): UserProfile | null => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
      console.error("Error loading profile:", error);
      return null;
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

  return { saveProfile, getProfile, uploadProfileImage, uploadCoverImage };
};
