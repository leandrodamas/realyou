
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { withRetry } from "./utils";
import { getLocalProfile, saveLocalProfile } from "./localStorageManager";
import { dispatchProfileUpdate } from "./eventManager";
import { syncProfileWithSupabase } from "./supabaseSync";

/**
 * Initializes user profile by fetching from Supabase or creating if needed
 * @param userId User ID
 * @param email User email
 */
export const initializeUserProfile = async (userId: string, email: string | undefined): Promise<void> => {
  console.log(`Initializing user profile for: ${userId}`);
  
  // Cache local data before trying to fetch from server
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
      
      // If there's already a local profile, use it
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
      
      // Sync unsynced changes
      if (localProfile && new Date(localProfile.lastUpdated) > new Date(profileData.updated_at || 0)) {
        console.log("Local profile is newer, syncing to server");
        await syncProfileWithSupabase(userId, localProfile);
      }
      
    } else {
      // If no profile in Supabase, create one
      console.log("No profile found in Supabase, creating one");
      const username = email?.split('@')[0] || 'user';
      
      // Use local data if available
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
      
      // Try to create profile in Supabase, with proper RLS policy handling
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

/**
 * Refreshes user profile with latest data from Supabase
 * @param userId User ID
 * @returns User profile or null
 */
export const refreshUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const localProfile = getLocalProfile(userId);
    
    // Try to fetch more recent data from server
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
      // Merge server data with local data to ensure we have all information
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
