
import React, { useState, useEffect } from "react";
import { ChevronsUpDown, Star, Loader2 } from "lucide-react";
import { Professional } from "@/types/Professional";
import ThreeDMap from "@/components/search/ThreeDMap";
import ProfessionalCard from "@/components/search/ProfessionalCard";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

interface MapViewProps {
  professionals: Professional[];
}

const MapView: React.FC<MapViewProps> = ({ professionals: initialProfessionals }) => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Carregar dados reais de profissionais com melhor tratamento de erros
  useEffect(() => {
    let isMounted = true;
    
    const loadRealProfessionals = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        // Se não houver usuário logado, usar dados iniciais (mockados)
        if (!user) {
          if (initialProfessionals.length > 0) {
            setProfessionals(initialProfessionals);
          } else {
            // Criar alguns dados de demonstração para usuários não logados
            const demoData = Array(5).fill(0).map((_, index) => {
              const lat = -23.55 + (Math.random() * 0.1 - 0.05);
              const lng = -46.63 + (Math.random() * 0.1 - 0.05);
              
              return {
                id: `demo-${index}`,
                name: `Profissional ${index + 1}`,
                title: "Especialista Demo",
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 5),
                price: 150 + (index * 10),
                distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10,
                available: Math.random() > 0.5 ? "Hoje" : "Amanhã",
                image: "https://randomuser.me/api/portraits/lego/1.jpg",
                coordinates: [lng, lat] as [number, number]
              };
            });
            
            setProfessionals(demoData);
          }
          setIsLoading(false);
          return;
        }

        // Implementar timeout para evitar espera infinita
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Tempo de carregamento excedido")), 8000);
        });

        // Buscar profissionais com preços de serviço
        const fetchPromise = supabase
          .from('service_pricing')
          .select(`
            id,
            title,
            base_price,
            user_id
          `);
          
        // Usar Promise.race para implementar timeout
        const { data: pricingData, error: pricingError } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as any;
        
        if (pricingError) throw pricingError;
        
        if (!pricingData || pricingData.length === 0) {
          if (isMounted) {
            setProfessionals([]);
            setIsLoading(false);
          }
          return;
        }
        
        // Buscar apenas IDs necessários para evitar sobrecarga
        const userIds = pricingData.map((item: any) => item.user_id);
        
        // Buscar dados de perfil para os profissionais encontrados com timeout
        const { data: profilesData, error: profilesError } = await Promise.race([
          supabase
            .from('profiles')
            .select(`
              id,
              full_name,
              profession,
              avatar_url
            `)
            .in('id', userIds),
          timeoutPromise
        ]) as any;
          
        if (profilesError) throw profilesError;
        
        if (!isMounted) return;
        
        // Combinar dados de preço e perfil - com geração mais consistente de dados aleatórios
        const transformedData = pricingData.map((pricing: any) => {
          // Encontrar o perfil correspondente
          const profile = profilesData?.find((p: any) => p.id === pricing.user_id) || null;
          
          // Usar seed baseado no ID para garantir consistência nas coordenadas
          const seed = pricing.id.charCodeAt(0) || 0;
          const lat = -23.55 + ((seed % 100) / 1000);
          const lng = -46.63 + ((seed % 10) / 100);
          
          return {
            id: pricing.id,
            name: profile?.full_name || "Profissional",
            title: profile?.profession || pricing.title || "Especialista",
            rating: 4.5 + ((seed % 5) / 10), // Rating mais consistente
            reviews: Math.max(1, seed % 10), // Pelo menos 1 review
            price: pricing.base_price,
            distance: Math.round(((seed % 10) / 2 + 0.5) * 10) / 10, // Distância consistente
            available: (seed % 2 === 0) ? "Hoje" : "Amanhã",
            image: profile?.avatar_url || "/placeholder.svg",
            coordinates: [lng, lat] as [number, number]
          };
        });
        
        if (isMounted) {
          setProfessionals(transformedData);
        }
      } catch (error) {
        console.error("Error loading professionals:", error);
        
        if (isMounted) {
          setLoadError("Não foi possível carregar os profissionais.");
          // Usar dados iniciais como fallback
          if (initialProfessionals.length > 0) {
            setProfessionals(initialProfessionals);
            toast.error("Usando dados offline devido a erro de conexão");
          } else {
            setProfessionals([]);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadRealProfessionals();
    
    return () => {
      isMounted = false;
    };
  }, [initialProfessionals, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-base">Carregando mapa...</span>
        <span className="text-xs text-gray-500 mt-1">Buscando profissionais próximos</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] p-4">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 mb-2">{loadError}</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-[calc(100vh-150px)]">
        <ThreeDMap professionals={professionals} />
      </div>
      
      {professionals.length > 0 ? (
        /* Drawer com profissionais - melhorado com carregamento progressivo */
        <Drawer>
          <DrawerTrigger asChild>
            <div className="fixed bottom-24 left-0 right-0 bg-white rounded-t-xl shadow-lg border-t border-gray-200 p-4">
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-gray-300 rounded-full mb-2"></div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{professionals.length} profissionais encontrados</h3>
                <ChevronsUpDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2 overflow-hidden">
                {professionals.slice(0, 1).map(pro => (
                  <div key={`${pro.id}`} className="flex items-center gap-3">
                    <img 
                      src={pro.image} 
                      alt={pro.name}
                      className="w-10 h-10 rounded-full object-cover" 
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{pro.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                        {pro.rating.toFixed(1)} • {pro.distance}km
                      </div>
                    </div>
                    <p className="text-right">
                      <span className="font-semibold">R${pro.price}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-2"></div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-4">{professionals.length} profissionais encontrados</h3>
              <div className="space-y-4">
                {professionals.map((pro, index) => (
                  <ProfessionalCard key={`${pro.id}`} professional={pro} />
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="fixed bottom-24 left-0 right-0 bg-white rounded-t-xl shadow-lg border-t border-gray-200 p-4">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-gray-300 rounded-full mb-2"></div>
          </div>
          <div className="text-center py-2">
            <p className="text-gray-500">Nenhum profissional encontrado nesta área</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
