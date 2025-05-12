
import { Professional } from "@/types/Professional";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Obter profissionais reais do banco de dados com coordenadas para o mapa 3D
export const getProfessionals = async (): Promise<Professional[]> => {
  try {
    console.log("Getting professionals from database");
    
    // Verificando se temos acesso à API do Supabase
    const { data: testConnection, error: connectionError } = await supabase.from('service_pricing').select('count', { count: 'exact' }).limit(1);
    
    if (connectionError) {
      console.error("Database connection error:", connectionError);
      
      // Usando dados mockados em caso de erro de conexão
      console.log("Using mock data");
      return generateMockProfessionals();
    }
    
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
      return generateMockProfessionals();
    }
    
    if (services.length === 0) {
      // Se não há serviços cadastrados, retornar dados mockados
      console.log("No services found, using mock data");
      return generateMockProfessionals();
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
      return generateMockProfessionals();
    }
    
    // Combinar dados e gerar coordenadas
    const professionals = services.map(service => {
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
    
    console.log(`Retrieved ${professionals.length} professionals from database`);
    return professionals;
  } catch (error) {
    console.error("Erro ao obter profissionais:", error);
    toast.error("Erro ao carregar profissionais");
    return generateMockProfessionals();
  }
};

// Função para gerar dados mockados em caso de falha na API
const generateMockProfessionals = (): Professional[] => {
  console.log("Generating mock professionals data");
  const mockProfessionals: Professional[] = [];
  
  const professions = [
    "Dentista", "Médico", "Fisioterapeuta", "Psicólogo", 
    "Nutricionista", "Personal Trainer", "Advogado", "Contador"
  ];
  
  const names = [
    "Ana Silva", "Carlos Oliveira", "Juliana Santos", "Marcos Pereira",
    "Patrícia Lima", "Roberto Alves", "Camila Costa", "Daniel Souza"
  ];
  
  for (let i = 0; i < 8; i++) {
    // Gerar coordenadas ao redor de São Paulo para demo
    const lat = -23.55 + (Math.random() * 0.1 - 0.05);
    const lng = -46.63 + (Math.random() * 0.1 - 0.05);
    
    mockProfessionals.push({
      id: `mock-${i}`,
      name: names[i],
      title: professions[i],
      rating: 4.5 + Math.random() * 0.5, // Avaliação aleatória entre 4.5-5.0
      reviews: Math.floor(Math.random() * 10), // Número baixo de avaliações para começar
      price: 50 + Math.floor(Math.random() * 200), // Preço entre 50-250
      distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Distância aleatória 0.5-5.5km
      available: Math.random() > 0.5 ? "Hoje" : "Amanhã",
      image: "/placeholder.svg",
      coordinates: [lng, lat] as [number, number]
    });
  }
  
  return mockProfessionals;
};

// Função de filtro para aplicar todos os filtros de uma vez
export const filterProfessionals = (
  professionals: Professional[],
  searchTerm: string,
  priceRange: number[],
  maxDistance: number,
  activeFilters: string[]
): Professional[] => {
  console.log("Filtering professionals with:", { 
    searchTerm, 
    priceRange, 
    maxDistance, 
    activeFilters 
  });
  
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
