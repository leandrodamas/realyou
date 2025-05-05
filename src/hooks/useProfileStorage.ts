
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  username?: string;
  fullName?: string;
  title?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  postCount?: number;
  connectionCount?: number;
  skillsCount?: number;
  lastUpdated?: string;
  createdAt?: string;
}

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
        : { id: currentUserId };
        
      // Merge and save
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...profile,
        id: currentUserId,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
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
