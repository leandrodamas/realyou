
import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initializeUserProfile } from "./userProfileManager";

// Maximum number of retries when loading profile data
const MAX_PROFILE_LOAD_RETRIES = 3;

export const useProfileLoader = () => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileLoadRetries, setProfileLoadRetries] = useState(0);

  // Function to load user profile from Supabase with retry mechanism
  const loadUserProfile = useCallback(async (userId: string, user: User | null) => {
    try {
      console.log("Loading profile for user:", userId);
      
      // Try to get profile from localStorage first as a fallback
      const localProfile = localStorage.getItem('userProfile');
      let localProfileData = null;
      
      if (localProfile) {
        try {
          localProfileData = JSON.parse(localProfile);
          console.log("Found local profile data:", localProfileData);
        } catch (e) {
          console.error("Error parsing local profile data:", e);
        }
      }
      
      // Calculate backoff time for exponential backoff (starting at 500ms)
      const backoffTime = Math.min(500 * Math.pow(2, profileLoadRetries), 10000);
      
      // Try to fetch profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        
        // If we've reached max retries and have local data, use the local data as fallback
        if (profileLoadRetries >= MAX_PROFILE_LOAD_RETRIES) {
          if (localProfileData) {
            console.log("Max retries reached, using local profile data");
            
            // Dispatch event to notify components that we're using cached profile data
            const event = new CustomEvent('profileLoaded', { 
              detail: { profile: localProfileData, cached: true } 
            });
            document.dispatchEvent(event);
            setProfileLoaded(true);
            return;
          }
          
          // If we have no local data, try to initialize a new profile
          console.log("No local profile data, initializing new profile");
          await initializeUserProfile(userId, user?.email);
          setProfileLoadRetries(0);
          return;
        }
        
        // If error is ERR_INSUFFICIENT_RESOURCES or similar, retry with exponential backoff
        console.log(`Retrying profile load in ${backoffTime}ms (retry ${profileLoadRetries + 1}/${MAX_PROFILE_LOAD_RETRIES})`);
        setTimeout(() => {
          setProfileLoadRetries(prev => prev + 1);
          loadUserProfile(userId, user);
        }, backoffTime);
        return;
      }
      
      // Reset retry counter on successful fetch
      setProfileLoadRetries(0);
      
      if (data) {
        console.log("Profile loaded successfully:", data);
        // Save profile data to localStorage for other components to access
        const profileData = {
          userId,
          id: userId,
          username: data.full_name || user?.email?.split('@')[0] || 'user',
          fullName: data.full_name,
          lastUpdated: new Date().toISOString(),
          avatar_url: data.avatar_url,
          profileImage: data.avatar_url,
          basePrice: 180,
          currency: 'BRL',
          title: 'Serviço Profissional'
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Dispatch an event to notify components that the profile was loaded
        const event = new CustomEvent('profileLoaded', { detail: { profile: data } });
        document.dispatchEvent(event);
        setProfileLoaded(true);
      } else {
        // No profile found, let's create one
        console.log("No profile data returned from Supabase, initializing profile");
        await initializeUserProfile(userId, user?.email);
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      
      // If we've reached max retries and have local data, use the local data as fallback
      const localProfile = localStorage.getItem('userProfile');
      if (profileLoadRetries >= MAX_PROFILE_LOAD_RETRIES && localProfile) {
        try {
          const localProfileData = JSON.parse(localProfile);
          console.log("Using local profile data after fetch error");
          
          const event = new CustomEvent('profileLoaded', { 
            detail: { profile: localProfileData, cached: true } 
          });
          document.dispatchEvent(event);
          setProfileLoaded(true);
        } catch (e) {
          console.error("Error parsing local profile data:", e);
        }
      } else if (userId) {
        // Try to initialize profile in case of error
        await initializeUserProfile(userId, user?.email);
      }
    }
  }, [profileLoadRetries]);

  return {
    profileLoaded,
    loadUserProfile,
    setProfileLoaded
  };
};
