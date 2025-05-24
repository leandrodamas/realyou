import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signIn = async (
  email: string,
  password: string,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  setIsLoading(true);
  try {
    console.log("Signing in with:", email);
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

export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    console.log("Iniciando login com Google");
    
    // Obter a URL atual completa para o redirecionamento
    const redirectUrl = window.location.origin;
    console.log("Redirect URL configurada:", redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // OAuth 2.0 configuration - using the client ID and secret
        scopes: 'email profile',
        // No need to specify client ID and secret directly here, these are managed in Supabase
      }
    });

    if (error) {
      console.error("Google sign in error:", error);
      toast.error(`Erro ao fazer login com Google: ${error.message}`);
      return false;
    }

    console.log("Google sign in initiated:", data);
    if (data?.url) {
      console.log("Redirecionando para:", data.url);
      window.location.href = data.url;
    } else {
      console.warn("URL de redirecionamento não recebida do Supabase");
      toast.error("Erro ao receber URL de redirecionamento do Google");
    }
    // No need for success message here as the page will redirect to Google
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
    console.log("Signing up with:", email);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          username: email.split('@')[0]
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
    
    // Check if email confirmation is required
    if (data.user && data.session) {
      // Auto-login if email confirmation is not enabled in Supabase
      toast.success("Conta criada com sucesso!");
      
      // Create initial profile for the user
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: email.split('@')[0],
            avatar_url: '/placeholder.svg',
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Error creating user profile:", profileError);
        } else {
          console.log("Created initial profile for user:", data.user.id);
        }
      } catch (profileError) {
        console.error("Exception creating profile:", profileError);
      }
      
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

export const signOut = async (setIsLoading: (loading: boolean) => void): Promise<void> => {
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

export const refreshSession = async () => {
  try {
    console.log("Refreshing session");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Refresh session error:", error);
      throw error;
    }
    console.log("Session refreshed:", data.session?.user?.id);
    return data;
  } catch (error: any) {
    console.error("Refresh session exception:", error);
    throw error;
  }
};
