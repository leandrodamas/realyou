
import React, { useState, useEffect } from "react";
import { ChevronsUpDown, Star, Loader2 } from "lucide-react";
import { Professional } from "@/types/Professional";
import ThreeDMap from "@/components/search/ThreeDMap";
import ProfessionalCard from "@/components/search/ProfessionalCard";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MapViewProps {
  professionals: Professional[];
}

const MapView: React.FC<MapViewProps> = ({ professionals: initialProfessionals }) => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar dados reais de profissionais da tabela service_pricing
  useEffect(() => {
    const loadRealProfessionals = async () => {
      setIsLoading(true);
      try {
        // Buscar profissionais com preços de serviço
        const { data: pricingData, error: pricingError } = await supabase
          .from('service_pricing')
          .select(`
            id,
            title,
            base_price,
            user_id
          `);
        
        if (pricingError) throw pricingError;
        
        if (!pricingData || pricingData.length === 0) {
          setProfessionals([]);
          setIsLoading(false);
          return;
        }
        
        // Buscar dados de perfil para os profissionais encontrados
        const userIds = pricingData.map(item => item.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            profession,
            avatar_url
          `)
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Combinar dados de preço e perfil
        const transformedData = pricingData.map(pricing => {
          // Encontrar o perfil correspondente
          const profile = profilesData?.find(p => p.id === pricing.user_id) || null;
          
          // Gerar coordenadas aleatórias próximas a São Paulo
          const lat = -23.55 + (Math.random() * 0.1 - 0.05);
          const lng = -46.63 + (Math.random() * 0.1 - 0.05);
          
          return {
            id: pricing.id,
            name: profile?.full_name || "Profissional",
            title: profile?.profession || pricing.title || "Especialista",
            rating: 4.5 + Math.random() * 0.5, // Avaliação aleatória entre 4.5-5.0
            reviews: Math.floor(Math.random() * 5), // Pequeno número de avaliações
            price: pricing.base_price,
            distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Distância aleatória 0.5-5.5km
            available: Math.random() > 0.5 ? "Hoje" : "Amanhã",
            image: profile?.avatar_url || "/placeholder.svg",
            coordinates: [lng, lat] as [number, number]
          };
        });
        
        setProfessionals(transformedData);
      } catch (error) {
        console.error("Error loading professionals:", error);
        toast.error("Erro ao carregar profissionais");
        // Manter array vazio se houver erro
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRealProfessionals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando mapa...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-[calc(100vh-150px)]">
        <ThreeDMap professionals={professionals} />
      </div>
      
      {professionals.length > 0 ? (
        /* Drawer com profissionais */
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
                    />
                    <div className="flex-1">
                      <p className="font-medium">{pro.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                        {pro.rating} • {pro.distance}km
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
                {professionals.map(pro => (
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
