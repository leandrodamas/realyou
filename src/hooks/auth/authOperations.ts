
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signIn = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    console.log("Attempting sign in with:", email);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      
      if (error.message.includes("Invalid login")) {
        toast.error("Email ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Por favor, confirme seu email antes de fazer login");
      } else {
        toast.error(`Erro ao fazer login: ${error.message}`);
      }
      return false;
    }
    
    console.log("Sign in successful for user:", data.user?.id);
    return true;
  } catch (error: any) {
    console.error("Sign in exception:", error);
    toast.error(`Erro ao fazer login: ${error.message}`);
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    console.log("Iniciando login com Google");
    
    const redirectUrl = `${window.location.origin}/auth`;
    console.log("Redirect URL configurada:", redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
      }
    });

    if (error) {
      console.error("Google sign in error:", error);
      toast.error(`Erro ao fazer login com Google: ${error.message}`);
      return false;
    }

    console.log("Google sign in initiated successfully");
    return true;
  } catch (error: any) {
    console.error("Google sign in exception:", error);
    toast.error(`Erro ao fazer login com Google: ${error.message}`);
    return false;
  }
};

export const signUp = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    console.log("Attempting sign up with:", email);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          full_name: email.split('@')[0]
        }
      }
    });

    if (error) {
      console.error("Sign up error:", error);
      
      if (error.message.includes("already registered")) {
        toast.error("Este email já está registrado. Tente fazer login.");
      } else {
        toast.error(`Erro ao criar conta: ${error.message}`);
      }
      return false;
    }
    
    console.log("Sign up response:", data);
    
    if (data.user && data.session) {
      toast.success("Conta criada com sucesso!");
      return true;
    } else if (data.user && !data.session) {
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

export const signOut = async (setIsLoading: (loading: boolean) => void): Promise<void> => {
  setIsLoading(true);
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      toast.error(`Erro ao fazer logout: ${error.message}`);
    } else {
      toast.success("Logout realizado com sucesso!");
    }
  } catch (error: any) {
    console.error("Sign out exception:", error);
    toast.error(`Erro ao fazer logout: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export const refreshSession = async () => {
  try {
    console.log("Refreshing session");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Refresh session error:", error);
      throw error;
    }
    console.log("Session refreshed successfully");
    return data;
  } catch (error: any) {
    console.error("Refresh session exception:", error);
    throw error;
  }
};
