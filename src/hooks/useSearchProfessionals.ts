
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Professional {
  id: string;
  name: string;
  username: string;
  avatar: string;
  title?: string;
  location?: string;
  rating?: number;
  skills?: string[];
}

export const useSearchProfessionals = (query: string = "") => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setIsLoading(true);

        // Buscar profissionais reais do banco de dados
        const { data: serviceProviders, error: serviceError } = await supabase
          .from('service_pricing')
          .select(`
            id,
            user_id,
            title,
            base_price
          `);
          
        if (serviceError) {
          console.error("Erro ao buscar serviços:", serviceError);
          setIsLoading(false);
          return;
        }
        
        if (!serviceProviders || serviceProviders.length === 0) {
          setProfessionals([]);
          setIsLoading(false);
          return;
        }
        
        // Obter IDs dos usuários para buscar seus perfis
        const userIds = serviceProviders.map(provider => provider.user_id);
        
        // Buscar perfis dos profissionais
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            profession,
            avatar_url
          `)
          .in('id', userIds);
          
        if (profilesError) {
          console.error("Erro ao buscar perfis:", profilesError);
          setIsLoading(false);
          return;
        }
        
        // Combinar dados de serviço e perfil
        const professionalsList: Professional[] = serviceProviders.map(service => {
          const profile = profiles?.find(p => p.id === service.user_id);
          
          return {
            id: service.id,
            name: profile?.full_name || "Profissional",
            username: profile?.id || service.id,
            avatar: profile?.avatar_url || "/placeholder.svg",
            title: profile?.profession || service.title,
            location: "São Paulo, SP", // Localização padrão por enquanto
            rating: 4.5 + Math.random() * 0.5, // Avaliação aleatória entre 4.5-5.0
            skills: ["Habilidade 1", "Habilidade 2"] // Habilidades padrão por enquanto
          };
        });
        
        // Filtrar por consulta, se fornecida
        const filteredResults = query
          ? professionalsList.filter(
              prof => 
                prof.name.toLowerCase().includes(query.toLowerCase()) ||
                prof.username.toLowerCase().includes(query.toLowerCase()) ||
                (prof.title && prof.title.toLowerCase().includes(query.toLowerCase()))
            )
          : professionalsList;

        setProfessionals(filteredResults);
      } catch (error) {
        console.error("Error searching professionals:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfessionals();
  }, [query, user]);

  return { professionals, isLoading };
};
