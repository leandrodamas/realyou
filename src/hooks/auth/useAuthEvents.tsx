
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
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user || null);

        if (event === "SIGNED_IN" && session?.user) {
          console.log("User signed in:", session.user.id);
          toast.success("Login realizado com sucesso!");
          
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
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Auth token refreshed");
        }
      }
    );

    // Check URL parameters for authentication errors
    const checkUrlForErrors = () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      if (error) {
        console.error("Auth error from redirect:", error, errorDescription);
        toast.error(`Erro de autenticação: ${errorDescription || error}`);
        
        // Clean URL params after processing
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    checkUrlForErrors();

    // Initial session check
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        console.log("Initial auth state:", data?.session ? "LOGGED_IN" : "LOGGED_OUT");
        
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
