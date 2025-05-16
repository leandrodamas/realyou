
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { withRetry } from "./utils";
import { getLocalProfile, saveLocalProfile } from "./localStorageManager";
import { dispatchProfileUpdate } from "./eventManager";
import { syncProfileWithSupabase } from "./supabaseSync";

/**
 * Inicializa perfil do usuário buscando do Supabase ou criando se necessário
 * @param userId ID do usuário
 * @param email Email do usuário
 */
export const initializeUserProfile = async (userId: string, email: string | undefined): Promise<void> => {
  console.log(`Initializing user profile for: ${userId}`);
  
  // Cache dados locais antes de tentar buscar do servidor
  const localProfile = getLocalProfile(userId);
  
  try {
    // Primeiro tenta obter perfil do Supabase com timeout
    const profilePromise = withRetry(async () => { 
      const response = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      return response;
    });
    
    // Adiciona timeout para não travar o carregamento
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout loading profile from Supabase")), 5000);
    });
    
    // Race entre o carregamento e o timeout
    const { data: profileData, error } = await Promise.race([
      profilePromise, 
      timeoutPromise.then(() => ({ data: null, error: new Error("Timeout") }))
    ]) as any;
    
    if (error) {
      console.error("Error fetching profile from Supabase:", error);
      
      // Se já existe um perfil local, usa ele
      if (localProfile) {
        dispatchProfileUpdate(localProfile);
        return;
      }
    }
    
    // Se perfil existe no Supabase, usa ele
    if (profileData) {
      console.log("Found existing profile in Supabase:", profileData);
      const profile: UserProfile = {
        userId: userId,
        id: userId,
        username: profileData.full_name || email?.split('@')[0] || 'user',
        fullName: profileData.full_name,
        avatar_url: profileData.avatar_url,
        profileImage: profileData.avatar_url,
        lastUpdated: new Date().toISOString(),
        basePrice: profileData.base_price || 180,
        currency: profileData.currency || 'BRL',
        title: profileData.profession || 'Serviço Profissional'
      };
      
      saveLocalProfile(profile);
      dispatchProfileUpdate(profile);
      
      // Sincroniza mudanças não sincronizadas
      if (localProfile && new Date(localProfile.lastUpdated) > new Date(profileData.updated_at || 0)) {
        console.log("Local profile is newer, syncing to server");
        await syncProfileWithSupabase(userId, localProfile);
      }
      
    } else {
      // Se não há perfil no Supabase, cria um
      console.log("No profile found in Supabase, creating one");
      const username = email?.split('@')[0] || 'user';
      
      // Usa dados locais se disponíveis
      const baseProfile = localProfile || {
        userId: userId,
        id: userId,
        username,
        fullName: username,
        lastUpdated: new Date().toISOString(),
        basePrice: 180,
        currency: 'BRL',
        title: 'Serviço Profissional'
      };
      
      // Tenta criar perfil no Supabase, com tratamento adequado de políticas RLS
      try {
        // Usa upsert para lidar com o caso em que o perfil já possa existir
        await withRetry(async () => {
          const response = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: baseProfile.fullName || baseProfile.username,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });
          return response;
        }).catch(err => {
          console.error("Error creating profile:", err);
        });
          
        console.log("Profile created or updated in Supabase for user:", userId);
      } catch (error) {
        console.error("Failed to create profile in Supabase:", error);
        console.log("Using local profile as fallback");
      }
      
      // Sempre usa dados locais se houver erro
      saveLocalProfile(baseProfile);
      dispatchProfileUpdate(baseProfile);
    }
    
  } catch (error) {
    console.error("Exception during profile initialization:", error);
    
    // Fallback para armazenamento local apenas se houver um erro
    if (localProfile) {
      console.log("Using local profile as fallback");
      dispatchProfileUpdate(localProfile);
      return;
    }
    
    const savedProfile = localStorage.getItem('userProfile');
    
    if (!savedProfile) {
      const initialProfile: UserProfile = {
        userId: userId,
        id: userId,
        username: email?.split('@')[0] || 'user',
        lastUpdated: new Date().toISOString(),
        basePrice: 180,
        currency: 'BRL',
        title: 'Serviço Profissional'
      };
      saveLocalProfile(initialProfile);
      dispatchProfileUpdate(initialProfile);
    }
  }
};

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
