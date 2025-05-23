
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthEvents = (
  setSession: (session: any) => void,
  setUser: (user: any) => void,
  setIsLoading: (loading: boolean) => void,
  loadUserProfile: (userId: string) => Promise<any>,
  setProfileLoaded: (loaded: boolean) => void
) => {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user || null);

        if (event === "SIGNED_IN" && session?.user) {
          console.log("Loading profile for user:", session.user.id);
          
          // Defer profile loading to avoid auth deadlocks
          setTimeout(() => {
            loadUserProfile(session.user!.id);
          }, 0);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setProfileLoaded(false);
          toast.success("Sessão encerrada");
        } else if (event === "USER_UPDATED") {
          toast.success("Perfil atualizado");
        }
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        console.log("Auth state changed:", data?.session ? "INITIAL_SESSION" : "NO_SESSION");
        
        setSession(data?.session);
        setUser(data?.session?.user || null);

        if (data?.session?.user) {
          // Defer profile loading to avoid auth deadlocks
          setTimeout(() => {
            loadUserProfile(data.session!.user.id);
          }, 0);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading, loadUserProfile, setProfileLoaded]);

  const handleSessionRefresh = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Session refresh error:", error);
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        setTimeout(() => {
          loadUserProfile(data.session!.user.id);
        }, 0);
      }
      
      return data;
    } catch (error) {
      console.error("Session refresh failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authInitialized,
    handleSessionRefresh,
  };
};
