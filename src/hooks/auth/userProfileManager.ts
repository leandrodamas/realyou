
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProfile {
  userId: string; // Made required to match useProfileStorage
  id: string; // Required to match with useProfileStorage
  username?: string;
  fullName?: string;
  avatar_url?: string;
  lastUpdated: string; // Made required to match with dispatchProfileUpdate usage
  profileImage?: string; // For compatibility with existing code
  basePrice?: number;
  currency?: string;
  title?: string;
}

// Maximum number of retries for profile operations
const MAX_RETRIES = 3;

// Helper function to implement retry logic with exponential backoff
const withRetry = async (operation: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Calculate backoff time - starts at 300ms and increases exponentially
    const backoff = Math.min(300 * Math.pow(2, MAX_RETRIES - retries), 5000);
    console.log(`Operation failed, retrying in ${backoff}ms (${retries} retries left)`);
    
    // Wait for the backoff period
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Retry the operation with one less retry
    return withRetry(operation, retries - 1);
  }
};

// Função para obter dados do perfil do localStorage com segurança
const getLocalProfile = (userId: string): UserProfile | null => {
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

// Função para salvar dados do perfil no localStorage com segurança
const saveLocalProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error("Erro ao salvar perfil localmente:", error);
  }
};

export const initializeUserProfile = async (userId: string, email: string | undefined): Promise<void> => {
  console.log(`Initializing user profile for: ${userId}`);
  
  // Cache de dados locais antes de tentar buscar do servidor
  const localProfile = getLocalProfile(userId);
  
  try {
    // First try to get profile from Supabase
    const { data: profileData, error } = await withRetry(async () => { 
      const response = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      return response;
    });
    
    if (error) {
      console.error("Error fetching profile from Supabase:", error);
      
      // Se já existir um perfil local, use ele
      if (localProfile) {
        dispatchProfileUpdate(localProfile);
        return;
      }
    }
    
    // If profile exists in Supabase, use it
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
      
      // Sincronizar alterações não sincronizadas
      if (localProfile && new Date(localProfile.lastUpdated) > new Date(profileData.updated_at || 0)) {
        console.log("Local profile is newer, syncing to server");
        await syncProfileWithSupabase(userId, localProfile);
      }
      
    } else {
      // If no profile in Supabase, create one
      console.log("No profile found in Supabase, creating one");
      const username = email?.split('@')[0] || 'user';
      
      // Utilizar dados locais se disponíveis
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
      
      // Tentar criar perfil no Supabase, with proper RLS policy handling
      try {
        // Use upsert to handle the case where the profile might already exist
        const { error: insertError } = await withRetry(async () => {
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
        });
          
        if (insertError) {
          console.error("Error creating profile in Supabase:", insertError);
          console.log("Using local profile as fallback");
        } else {
          console.log("Successfully created profile in Supabase for user:", userId);
        }
      } catch (error) {
        console.error("Failed to create profile in Supabase:", error);
        console.log("Using local profile as fallback");
      }
      
      // Always use local data if there's an error
      saveLocalProfile(baseProfile);
      dispatchProfileUpdate(baseProfile);
    }
    
  } catch (error) {
    console.error("Exception during profile initialization:", error);
    
    // Fallback to local storage only if there's an error
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

export const clearUserProfile = (): void => {
  localStorage.removeItem('userProfile');
};

export const dispatchProfileUpdate = (profile: UserProfile): void => {
  try {
    const event = new CustomEvent('profileUpdated', { 
      detail: { profile } 
    });
    document.dispatchEvent(event);
    console.log("Profile update event dispatched:", profile);
  } catch (error) {
    console.error("Error dispatching profile update event:", error);
  }
};

export const syncProfileWithSupabase = async (userId: string, profileData: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Verificar conexão antes de tentar a sincronização
    const online = navigator.onLine;
    if (!online) {
      console.log("Device is offline, will sync later");
      
      // Marcar dados para sincronização posterior quando online
      try {
        const pendingSyncs = JSON.parse(localStorage.getItem('pendingProfileSyncs') || '[]');
        pendingSyncs.push({userId, profileData, timestamp: new Date().toISOString()});
        localStorage.setItem('pendingProfileSyncs', JSON.stringify(pendingSyncs));
      } catch (error) {
        console.error("Error saving pending sync data:", error);
      }
      
      return false;
    }
    
    // Fields to sync with Supabase
    const supabaseData: any = {};
    
    if (profileData.fullName) {
      supabaseData.full_name = profileData.fullName;
    }
    
    if (profileData.profileImage) {
      supabaseData.avatar_url = profileData.profileImage;
    }
    
    if (profileData.basePrice) {
      supabaseData.base_price = profileData.basePrice;
    }
    
    if (profileData.title) {
      supabaseData.profession = profileData.title;
    }
    
    if (Object.keys(supabaseData).length > 0) {
      supabaseData.updated_at = new Date().toISOString();
      
      // Use upsert instead of update to handle cases where the profile might not exist yet
      const { error } = await withRetry(async () => {
        const response = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            ...supabaseData
          }, {
            onConflict: 'id'
          });
        return response;
      });
        
      if (error) {
        console.error("Error updating profile in Supabase:", error);
        return false;
      }
      
      console.log("Successfully updated profile in Supabase:", supabaseData);
    }
    
    // Processar qualquer sincronização pendente
    try {
      const pendingSyncs = JSON.parse(localStorage.getItem('pendingProfileSyncs') || '[]');
      if (pendingSyncs.length > 0) {
        // Tentar processar apenas as sincronizações do usuário atual
        const userSyncs = pendingSyncs.filter((sync: any) => sync.userId === userId);
        const otherSyncs = pendingSyncs.filter((sync: any) => sync.userId !== userId);
        
        for (const sync of userSyncs) {
          await syncProfileWithSupabase(sync.userId, sync.profileData);
        }
        
        // Atualizar apenas as sincronizações pendentes que não foram processadas
        localStorage.setItem('pendingProfileSyncs', JSON.stringify(otherSyncs));
      }
    } catch (error) {
      console.error("Error processing pending syncs:", error);
    }
    
    return true;
  } catch (error) {
    console.error("Exception during profile sync with Supabase:", error);
    return false;
  }
};

// Adicionar função para manter o perfil atualizado com os dados mais recentes
export const refreshUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const localProfile = getLocalProfile(userId);
    
    // Tentar buscar dados mais recentes do servidor
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
      // Mesclar dados do servidor com dados locais para garantir que temos todas as informações
      const updatedProfile: UserProfile = {
        userId: userId,
        id: userId,
        username: profileData.full_name || localProfile?.username || 'user',
        fullName: profileData.full_name || localProfile?.fullName,
        avatar_url: profileData.avatar_url,
        profileImage: profileData.avatar_url || localProfile?.profileImage,
        lastUpdated: new Date().toISOString(),
        basePrice: profileData.base_price || localProfile?.basePrice || 180,
        currency: profileData.currency || localProfile?.currency || 'BRL',
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
