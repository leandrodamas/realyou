
import { Professional } from "@/types/Professional";
import { supabase } from "@/integrations/supabase/client";

// Obter profissionais reais do banco de dados com coordenadas para o mapa 3D
export const getProfessionals = async (): Promise<Professional[]> => {
  try {
    // Buscar profissionais com preços de serviço
    const { data: services, error: servicesError } = await supabase
      .from('service_pricing')
      .select(`
        id,
        user_id,
        title,
        base_price,
        duration_minutes
      `);
      
    if (servicesError || !services) {
      console.error("Erro ao buscar serviços:", servicesError);
      return [];
    }
    
    if (services.length === 0) {
      // Se não há serviços cadastrados, retornar array vazio
      return [];
    }
    
    // Buscar perfis dos profissionais
    const userIds = services.map(service => service.user_id);
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
      return [];
    }
    
    // Combinar dados e gerar coordenadas
    return services.map(service => {
      const profile = profiles?.find(p => p.id === service.user_id);
      
      // Gerar coordenadas ao redor de São Paulo para demo
      const lat = -23.55 + (Math.random() * 0.1 - 0.05);
      const lng = -46.63 + (Math.random() * 0.1 - 0.05);
      
      return {
        id: service.id,
        name: profile?.full_name || "Profissional",
        title: profile?.profession || service.title || "Especialista",
        rating: 4.5 + Math.random() * 0.5, // Avaliação aleatória entre 4.5-5.0
        reviews: Math.floor(Math.random() * 10), // Número baixo de avaliações para começar
        price: service.base_price,
        distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Distância aleatória 0.5-5.5km
        available: Math.random() > 0.5 ? "Hoje" : "Amanhã",
        image: profile?.avatar_url || "/placeholder.svg",
        coordinates: [lng, lat] as [number, number]
      };
    });
  } catch (error) {
    console.error("Erro ao obter profissionais:", error);
    return [];
  }
};

// Função de filtro para aplicar todos os filtros de uma vez
export const filterProfessionals = (
  professionals: Professional[],
  searchTerm: string,
  priceRange: number[],
  maxDistance: number,
  activeFilters: string[]
): Professional[] => {
  return professionals.filter(pro => {
    // Aplicar filtro de termo de pesquisa
    if (searchTerm && !pro.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !pro.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Aplicar filtro de faixa de preço
    if (pro.price < priceRange[0] || pro.price > priceRange[1]) {
      return false;
    }
    
    // Aplicar filtro de distância
    if (pro.distance > maxDistance) {
      return false;
    }
    
    // Aplicar filtros específicos
    if (activeFilters.includes("today") && pro.available !== "Hoje") {
      return false;
    }
    
    if (activeFilters.includes("highRated") && pro.rating < 4.8) {
      return false;
    }
    
    return true;
  });
};
