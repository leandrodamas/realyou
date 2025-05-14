
import { UserProfile } from "./types";

/**
 * Gets profile data from localStorage safely
 * @param userId User ID
 * @returns User profile or null if not found
 */
export const getLocalProfile = (userId: string): UserProfile | null => {
  try {
    const savedProfile = localStorage.getItem('userProfile');
    if (!savedProfile) return null;
    
    const parsedProfile = JSON.parse(savedProfile);
    if (parsedProfile && parsedProfile.userId === userId) {
      return parsedProfile;
    }
    return null;
  } catch (error) {
    console.error("Erro ao ler perfil local:", error);
    return null;
  }
};

/**
 * Saves profile data to localStorage safely
 * @param profile User profile to save
 */
export const saveLocalProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error("Erro ao salvar perfil localmente:", error);
  }
};

/**
 * Clears user profile data from localStorage
 */
export const clearUserProfile = (): void => {
  localStorage.removeItem('userProfile');
};
