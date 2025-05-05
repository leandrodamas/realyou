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
  const [isLoading, setIsLoading] = useState(false);
  
  // Load real professionals data from service_pricing table
  useEffect(() => {
    const loadRealProfessionals = async () => {
      setIsLoading(true);
      try {
        // Get professionals from service_pricing table
        const { data, error } = await supabase
          .from('service_pricing')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url,
              location
            )
          `);
        
        if (error) throw error;
        
        // If we have data, transform it to Professional type
        if (data && data.length > 0) {
          // Generate random coordinates around São Paulo for demo purposes
          const transformedData = data.map(item => {
            // São Paulo coordinates with small random offsets
            const lat = -23.55 + (Math.random() * 0.1 - 0.05);
            const lng = -46.63 + (Math.random() * 0.1 - 0.05);
            
            return {
              id: item.id,
              name: item.profiles?.full_name || "Profissional",
              title: item.title || "Especialista",
              rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
              reviews: Math.floor(Math.random() * 100) + 10, // Random reviews count
              price: item.base_price,
              distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Random distance 0.5-5.5km
              available: Math.random() > 0.5 ? "Hoje" : "Amanhã",
              image: item.profiles?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
              coordinates: [lng, lat] as [number, number]
            };
          });
          
          // If we have real data, use it. Otherwise, keep initial data
          if (transformedData.length > 0) {
            setProfessionals(transformedData);
          }
        }
      } catch (error) {
        console.error("Error loading professionals:", error);
        // Keep initial professionals data if there's an error
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only try to load real data if we're connected to Supabase
    loadRealProfessionals();
  }, [initialProfessionals]);

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
      
      {/* Bottom drawer with professionals */}
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
                <div key={pro.id} className="flex items-center gap-3">
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
                <ProfessionalCard key={pro.id} professional={pro} />
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MapView;
