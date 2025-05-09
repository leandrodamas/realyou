
import React, { useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContext } from "./AuthContext";
import { signIn, signUp, signOut, refreshSession } from "./authOperations";
import { initializeUserProfile, clearUserProfile } from "./userProfileManager";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSessionRefresh = useCallback(async () => {
    try {
      const { session } = await refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, []);

  // Function to load user profile from Supabase
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Erro ao carregar perfil:", error);
        return;
      }
      
      if (data) {
        // Save profile data to localStorage for other components to access
        const profileData = {
          userId,
          username: data.full_name || user?.email?.split('@')[0] || 'user',
          lastUpdated: new Date().toISOString(),
          profession: data.profession,
          avatar_url: data.avatar_url,
          // Add other profile fields as needed
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Dispatch an event to notify components that the profile was loaded
        const event = new CustomEvent('profileLoaded', { detail: { profile: profileData } });
        document.dispatchEvent(event);
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
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
            loadUserProfile(currentSession.user.id);
            
            setTimeout(() => {
              initializeUserProfile(currentSession.user.id, currentSession.user.email);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Sessão encerrada");
          clearUserProfile(); // Clear profile on sign out
        } else if (event === 'USER_UPDATED') {
          toast.info("Perfil atualizado");
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
      }
      
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
        refreshSession: handleSessionRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
