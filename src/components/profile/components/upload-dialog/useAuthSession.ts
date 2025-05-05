
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useAuthSession = (open: boolean) => {
  const { session, refreshSession } = useAuth();

  useEffect(() => {
    if (open && !session) {
      refreshSession();
    }
  }, [open, session, refreshSession]);

  return { session };
};
