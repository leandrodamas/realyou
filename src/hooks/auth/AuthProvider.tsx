
import React, { useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContext } from "./AuthContext";
import { signIn, signUp, signOut, refreshSession } from "./authOperations";
import { initializeUserProfile, clearUserProfile, syncProfileWithSupabase } from "./userProfileManager";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const handleSessionRefresh = useCallback(async () => {
    try {
      const { session } = await refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Dispatch an event to notify components of auth state changes
      const event = new CustomEvent('authStateChange', { detail: { user: session?.user } });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, []);

  // Function to load user profile from Supabase
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      console.log("Loading profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        
        // If we get a "no rows" error, try to initialize the profile
        if (error.code === 'PGRST116') {
          console.log("No profile found, initializing profile for:", userId);
          await initializeUserProfile(userId, user?.email);
          return;
        }
        return;
      }
      
      if (data) {
        console.log("Profile loaded successfully:", data);
        // Save profile data to localStorage for other components to access
        const profileData = {
          userId,
          username: data.full_name || user?.email?.split('@')[0] || 'user',
          fullName: data.full_name,
          lastUpdated: new Date().toISOString(),
          avatar_url: data.avatar_url,
          profileImage: data.avatar_url,
          // Add other profile fields as needed
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
      
      // Try to initialize profile in case of error
      if (userId) {
        await initializeUserProfile(userId, user?.email);
      }
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Login realizado com sucesso!");
          
          // Initialize user profile if needed
          if (currentSession?.user) {
            // Load user profile from Supabase
            setTimeout(() => {
              loadUserProfile(currentSession.user.id);
              
              // Dispatch auth state change event
              const authChangeEvent = new CustomEvent('authStateChange', { 
                detail: { user: currentSession.user } 
              });
              document.dispatchEvent(authChangeEvent);
            }, 100);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Sessão encerrada");
          clearUserProfile(); // Clear profile on sign out
          setProfileLoaded(false);
          
          // Dispatch auth state change event
          const authChangeEvent = new CustomEvent('authStateChange', { 
            detail: { user: null } 
          });
          document.dispatchEvent(authChangeEvent);
        } else if (event === 'USER_UPDATED') {
          toast.info("Perfil atualizado");
          
          if (currentSession?.user) {
            loadUserProfile(currentSession.user.id);
          }
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.info("Recuperação de senha solicitada");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking existing session:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // If there's an existing session, load the user profile
      if (currentSession?.user) {
        loadUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    return await signIn(email, password, setIsLoading);
  };

  const handleSignUp = async (email: string, password: string): Promise<boolean> => {
    return await signUp(email, password, setIsLoading);
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut(setIsLoading);
  };

  return (
    <AuthContext.Provider 
      value={{
        session,
        user,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshSession: handleSessionRefresh,
        profileLoaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
