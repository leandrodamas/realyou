
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { withRetry } from "./utils";
import { getLocalProfile, saveLocalProfile } from "./localStorageManager";
import { dispatchProfileUpdate } from "./eventManager";

export const initializeUserProfile = async (userId: string): Promise<void> => {
  console.log(`Initializing user profile for: ${userId}`);
  
  const localProfile = getLocalProfile(userId);
  
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error("Error checking existing profile:", fetchError);
    }
    
    if (existingProfile) {
      console.log("Found existing profile:", existingProfile);
      const profile: UserProfile = {
        userId: userId,
        id: userId,
        username: existingProfile.full_name || 'user',
        fullName: existingProfile.full_name,
        avatar_url: existingProfile.avatar_url,
        profileImage: existingProfile.avatar_url,
        lastUpdated: new Date().toISOString(),
        basePrice: 180,
        currency: 'BRL',
        title: existingProfile.profession || 'Serviço Profissional'
      };
      
      saveLocalProfile(profile);
      dispatchProfileUpdate(profile);
      return;
    }
    
    // Create new profile if it doesn't exist
    console.log("Creating new profile for user:", userId);
    
    const newProfileData = {
      id: userId,
      full_name: localProfile?.fullName || 'Usuário',
      profession: localProfile?.title || 'Profissional',
      avatar_url: localProfile?.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert(newProfileData)
      .select()
      .single();
    
    if (createError) {
      console.error("Error creating profile:", createError);
      // Use local profile as fallback
      if (localProfile) {
        dispatchProfileUpdate(localProfile);
        return;
      }
    } else {
      console.log("Profile created successfully:", createdProfile);
    }
    
    // Create local profile regardless of Supabase result
    const profile: UserProfile = {
      userId: userId,
      id: userId,
      username: newProfileData.full_name,
      fullName: newProfileData.full_name,
      avatar_url: newProfileData.avatar_url,
      profileImage: newProfileData.avatar_url,
      lastUpdated: new Date().toISOString(),
      basePrice: 180,
      currency: 'BRL',
      title: newProfileData.profession
    };
    
    saveLocalProfile(profile);
    dispatchProfileUpdate(profile);
    
  } catch (error) {
    console.error("Exception during profile initialization:", error);
    
    // Fallback to local storage
    const fallbackProfile: UserProfile = {
      userId: userId,
      id: userId,
      username: 'user',
      fullName: 'Usuário',
      lastUpdated: new Date().toISOString(),
      basePrice: 180,
      currency: 'BRL',
      title: 'Serviço Profissional'
    };
    
    saveLocalProfile(fallbackProfile);
    dispatchProfileUpdate(fallbackProfile);
  }
};
