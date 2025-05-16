
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { withRetry } from "./utils";
import { getLocalProfile, saveLocalProfile } from "./localStorageManager";
import { dispatchProfileUpdate } from "./eventManager";

/**
 * Atualiza o perfil do usuário com os dados mais recentes do Supabase
 * @param userId ID do usuário
 * @returns Perfil do usuário ou null
 */
export const refreshUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const localProfile = getLocalProfile(userId);
    
    // Tenta buscar dados mais recentes do servidor
    const { data: profileData, error } = await withRetry(async () => {
      const response = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      return response;
    });
    
    if (error) {
      console.error("Error refreshing profile from Supabase:", error);
      return localProfile;
    }
    
    if (profileData) {
      // Mescla dados do servidor com dados locais para garantir que tenhamos todas as informações
      const updatedProfile: UserProfile = {
        userId: userId,
        id: userId,
        username: profileData.full_name || localProfile?.username || 'user',
        fullName: profileData.full_name || localProfile?.fullName,
        avatar_url: profileData.avatar_url,
        profileImage: profileData.avatar_url || localProfile?.profileImage,
        lastUpdated: new Date().toISOString(),
        basePrice: localProfile?.basePrice || 180,
        currency: localProfile?.currency || 'BRL',
        title: profileData.profession || localProfile?.title || 'Serviço Profissional'
      };
      
      saveLocalProfile(updatedProfile);
      dispatchProfileUpdate(updatedProfile);
      return updatedProfile;
    }
    
    return localProfile;
    
  } catch (error) {
    console.error("Exception during profile refresh:", error);
    return getLocalProfile(userId);
  }
};
