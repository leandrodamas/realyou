import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  userId: string; // Made required to match useProfileStorage
  id: string; // Required to match with useProfileStorage
  username?: string;
  fullName?: string;
  avatar_url?: string;
  lastUpdated: string; // Made required to match with dispatchProfileUpdate usage
  profileImage?: string; // For compatibility with existing code
}

export const initializeUserProfile = async (userId: string, email: string | undefined): Promise<void> => {
  console.log(`Initializing user profile for: ${userId}`);
  
  try {
    // First try to get profile from Supabase
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching profile from Supabase:", error);
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
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(profile));
      dispatchProfileUpdate(profile);
      
    } else {
      // If no profile in Supabase, create one
      console.log("No profile found in Supabase, creating one");
      const username = email?.split('@')[0] || 'user';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: username,
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error("Error creating profile in Supabase:", insertError);
      } else {
        console.log("Successfully created profile in Supabase for user:", userId);
      }
      
      // Set up local storage
      const initialProfile: UserProfile = {
        userId: userId,
        id: userId,
        username: username,
        fullName: username,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userProfile', JSON.stringify(initialProfile));
      dispatchProfileUpdate(initialProfile);
    }
    
  } catch (error) {
    console.error("Exception during profile initialization:", error);
    
    // Fallback to local storage only if there's an error
    const savedProfile = localStorage.getItem('userProfile');
    
    if (!savedProfile) {
      const initialProfile: UserProfile = {
        userId: userId,
        id: userId,
        username: email?.split('@')[0] || 'user',
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userProfile', JSON.stringify(initialProfile));
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
    // Fields to sync with Supabase
    const supabaseData: any = {};
    
    if (profileData.fullName) {
      supabaseData.full_name = profileData.fullName;
    }
    
    if (profileData.profileImage) {
      supabaseData.avatar_url = profileData.profileImage;
    }
    
    if (Object.keys(supabaseData).length > 0) {
      supabaseData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(supabaseData)
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating profile in Supabase:", error);
        return false;
      }
      
      console.log("Successfully updated profile in Supabase:", supabaseData);
    }
    
    return true;
  } catch (error) {
    console.error("Exception during profile sync with Supabase:", error);
    return false;
  }
};
