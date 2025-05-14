
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { withRetry } from "./utils";
import { getLocalProfile } from "./localStorageManager";

/**
 * Synchronizes profile data with Supabase
 * @param userId User ID
 * @param profileData Profile data to sync
 * @returns Success status
 */
export const syncProfileWithSupabase = async (userId: string, profileData: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Check connection before trying to sync
    const online = navigator.onLine;
    if (!online) {
      console.log("Device is offline, will sync later");
      
      // Mark data for later sync when online
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
    
    // Process any pending syncs
    try {
      const pendingSyncs = JSON.parse(localStorage.getItem('pendingProfileSyncs') || '[]');
      if (pendingSyncs.length > 0) {
        // Try to process only the current user's syncs
        const userSyncs = pendingSyncs.filter((sync: any) => sync.userId === userId);
        const otherSyncs = pendingSyncs.filter((sync: any) => sync.userId !== userId);
        
        for (const sync of userSyncs) {
          await syncProfileWithSupabase(sync.userId, sync.profileData);
        }
        
        // Update only the pending syncs that weren't processed
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
