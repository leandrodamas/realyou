
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserProfile {
  userId?: string;
  username?: string;
  fullName?: string;
  profileImage?: string;
  coverImage?: string;
  faceRegistered?: boolean;
  registrationTimestamp?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export const useProfileStorage = () => {
  const { user } = useAuth();

  const saveProfile = (profileData: Partial<UserProfile>): void => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile = {
        ...profile,
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Notify other components about the profile update
      document.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { profile: updatedProfile } 
      }));
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
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
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
      const filePath = `${user.id}/cover/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Erro ao fazer upload da imagem de capa");
      return null;
    }
  };

  return { saveProfile, getProfile, uploadProfileImage, uploadCoverImage };
};
