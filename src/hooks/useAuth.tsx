
import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            setTimeout(() => {
              const savedProfile = localStorage.getItem('userProfile');
              if (!savedProfile) {
                const initialProfile = {
                  userId: currentSession.user.id,
                  username: currentSession.user.email?.split('@')[0],
                  lastUpdated: new Date().toISOString()
                };
                localStorage.setItem('userProfile', JSON.stringify(initialProfile));
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Sessão encerrada");
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
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Signing in with:", email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast.error(`Erro ao fazer login: ${error.message}`);
        return false;
      }
      
      console.log("Sign in successful:", data.user?.id);
      return true;
    } catch (error: any) {
      console.error("Sign in exception:", error);
      toast.error(`Erro ao fazer login: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Signing up with:", email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        toast.error(`Erro ao criar conta: ${error.message}`);
        return false;
      }
      
      console.log("Sign up successful:", data);
      
      // Check if email confirmation is required
      if (data.user && data.session) {
        // Auto-login if email confirmation is not enabled in Supabase
        toast.success("Conta criada com sucesso!");
        return true;
      } else if (data.user && !data.session) {
        // Email confirmation is required
        toast.info("Conta criada! Por favor, verifique seu email para confirmar.");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Sign up exception:", error);
      toast.error(`Erro ao criar conta: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Erro ao fazer logout: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Sign out exception:", error);
      toast.error(`Erro ao fazer logout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = useCallback(async () => {
    try {
      console.log("Refreshing session");
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Refresh session error:", error);
        throw error;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      console.log("Session refreshed:", data.session?.user?.id);
    } catch (error: any) {
      console.error("Refresh session exception:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signIn, signUp, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
