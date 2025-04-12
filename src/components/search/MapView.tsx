
import React from "react";
import { ChevronsUpDown, Star } from "lucide-react";
import { Professional } from "@/types/Professional";
import ThreeDMap from "@/components/search/ThreeDMap";
import ProfessionalCard from "@/components/search/ProfessionalCard";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface MapViewProps {
  professionals: Professional[];
}

const MapView: React.FC<MapViewProps> = ({ professionals }) => {
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
