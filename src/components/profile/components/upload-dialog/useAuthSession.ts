
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthSession = (open: boolean) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        // If no session found, check if there's an active user
        if (!data.session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // We have a user but no session, refresh auth
            const { data: refreshedData } = await supabase.auth.refreshSession();
            setSession(refreshedData.session);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    
    checkUserAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [open]); // Re-check when dialog opens

  return { session };
};
