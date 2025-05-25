
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
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);

        if (event === "SIGNED_IN" && session?.user) {
          console.log("User signed in:", session.user.id);
          toast.success("Login realizado com sucesso!");
          
          // Load profile with delay to avoid auth conflicts
          setTimeout(() => {
            if (mounted) {
              loadUserProfile(session.user!.id);
            }
          }, 100);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setProfileLoaded(false);
          localStorage.removeItem('userProfile');
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Auth token refreshed");
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Initial session check:", session ? "LOGGED_IN" : "LOGGED_OUT");
          
          if (mounted) {
            setSession(session);
            setUser(session?.user || null);

            if (session?.user) {
              setTimeout(() => {
                if (mounted) {
                  loadUserProfile(session.user!.id);
                }
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
        }, 100);
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
