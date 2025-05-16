
import { useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearUserProfile } from "./profile";

export const useAuthEvents = (
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loadUserProfile: (userId: string, user: User | null) => Promise<void>,
  setProfileLoaded: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Configurar ouvinte para mudanças no estado de autenticação
  useEffect(() => {
    // Definir um timeout para carregar a página mesmo se houver problemas
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      console.log("Auth loading timeout occurred, continuing anyway");
    }, 3000);
    
    setIsLoading(true);
    
    // Ouvir primeiro para eventos de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        // Importante atualizar imediatamente para evitar erros de ordem de execução
        setUser(newSession?.user || null);
        setSession(newSession);

        // Limpar o timeout pois recebemos uma resposta
        clearTimeout(loadingTimeout);
        
        // Lidar com diferentes eventos de autenticação
        if (event === "SIGNED_OUT") {
          clearUserProfile();
          setProfileLoaded(false);
          setIsLoading(false);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (newSession?.user) {
            // Usar setTimeout para evitar deadlock com Supabase
            setTimeout(() => {
              loadUserProfile(newSession.user.id, newSession.user)
                .finally(() => {
                  setIsLoading(false);
                });
            }, 0);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    );
    
    // Verificar sessão existente
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setSession(session);

        if (session?.user) {
          await loadUserProfile(session.user.id, session.user);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Iniciar validação de sessão
    checkSession();
    
    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading, loadUserProfile, setProfileLoaded]);
  
  // Função para atualizar a sessão
  const handleSessionRefresh = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        loadUserProfile(session.user.id, session.user);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };
  
  return { handleSessionRefresh };
};
