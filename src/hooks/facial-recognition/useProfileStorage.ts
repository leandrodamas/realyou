
import { toast } from "sonner";

export interface UserProfile {
  userId?: string;
  username?: string;
  fullName?: string;
  profileImage?: string;
  faceRegistered?: boolean;
  registrationTimestamp?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export const useProfileStorage = () => {
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

  return { saveProfile, getProfile };
};
