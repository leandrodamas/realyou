
import { useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { clearUserProfile } from "./userProfileManager";

export const useAuthEvents = (
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  loadUserProfile: (userId: string, user: User | null) => Promise<void>,
  setProfileLoaded: (loaded: boolean) => void
) => {
  const handleSessionRefresh = useCallback(async () => {
    try {
      const { data } = await supabase.auth.refreshSession();
      const { session } = data;
      setSession(session);
      setUser(session?.user ?? null);
      
      // Dispatch an event to notify components of auth state changes
      const event = new CustomEvent('authStateChange', { detail: { user: session?.user } });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [setSession, setUser]);

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
              loadUserProfile(currentSession.user.id, currentSession.user);
              
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
            loadUserProfile(currentSession.user.id, currentSession.user);
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
        loadUserProfile(currentSession.user.id, currentSession.user);
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
  }, [loadUserProfile, setIsLoading, setProfileLoaded, setSession, setUser]);

  return {
    handleSessionRefresh
  };
};
