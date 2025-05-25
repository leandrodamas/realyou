
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Interface atualizada para incluir coordenadas
export interface Professional {
  id: string; // ID do serviço/preço
  user_id: string; // ID do usuário (perfil)
  name: string;
  username: string;
  avatar: string;
  title?: string;
  location?: string; // Endereço textual
  coordinates?: { lat: number; lng: number }; // Coordenadas geográficas
  rating?: number;
  skills?: string[];
  base_price?: number;
}

export const useSearchProfessionals = (query: string = "") => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Pode ser usado para filtrar/personalizar busca no futuro

  useEffect(() => {
    const loadProfessionals = async () => {
      setIsLoading(true);
      try {
        // 1. Buscar serviços/preços (ponto de partida para encontrar profissionais ativos)
        const { data: serviceProviders, error: serviceError } = await supabase
          .from("service_pricing") // Tabela que indica quem oferece serviços
          .select(`
            id,
            user_id,
            title,
            base_price
          `);

        if (serviceError) {
          console.error("Erro ao buscar serviços:", serviceError);
          throw serviceError; // Propagar erro
        }

        if (!serviceProviders || serviceProviders.length === 0) {
          setProfessionals([]);
          setIsLoading(false);
          return;
        }

        // 2. Obter IDs únicos dos usuários (profissionais)
        const userIds = [...new Set(serviceProviders.map(provider => provider.user_id))];

        // 3. Buscar perfis desses profissionais
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            profession,
            avatar_url,
            address
          `)
          .in("id", userIds);

        if (profilesError) {
          console.error("Erro ao buscar perfis:", profilesError);
          throw profilesError; // Propagar erro
        }

        if (!profiles) {
            setProfessionals([]);
            setIsLoading(false);
            return;
        }

        // 4. Combinar dados de serviço e perfil
        const professionalsList: Professional[] = serviceProviders.map(service => {
          const profile = profiles.find(p => p.id === service.user_id);

          // Se não encontrar perfil correspondente, pula este serviço
          if (!profile) return null;

          return {
            id: service.id, // Usando ID do serviço como ID principal por enquanto
            user_id: profile.id,
            name: profile.full_name || "Profissional",
            username: profile.id, // Usar ID do perfil como username
            avatar: profile.avatar_url || "/placeholder.svg",
            title: profile.profession || service.title || "Profissional",
            location: profile.address || "Localização não informada",
            rating: 4.7, // Placeholder - buscar de uma tabela de avaliações?
            skills: ["React", "Node.js", "Supabase"], // Placeholder - buscar de uma tabela de skills?
            base_price: service.base_price
          };
        }).filter(p => p !== null) as Professional[]; // Filtra nulos e ajusta tipo

        // 5. Filtrar por consulta (query), se fornecida
        const filteredResults = query
          ? professionalsList.filter(
              prof =>
                prof.name.toLowerCase().includes(query.toLowerCase()) ||
                (prof.title && prof.title.toLowerCase().includes(query.toLowerCase())) ||
                (prof.location && prof.location.toLowerCase().includes(query.toLowerCase())) ||
                (prof.skills && prof.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())))
            )
          : professionalsList;

        setProfessionals(filteredResults);

      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
        setProfessionals([]); // Limpa em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    loadProfessionals();
  }, [query]); // Dependência apenas na query, user pode ser adicionado se a busca for personalizada

  return { professionals, isLoading };
};
