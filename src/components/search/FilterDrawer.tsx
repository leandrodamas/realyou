
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Calendar, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRange: number[];
  setPriceRange: (values: number[]) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  activeFilters: string[];
  addRemoveFilter: (filter: string) => void;
  resetFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onOpenChange,
  priceRange,
  setPriceRange,
  maxDistance,
  setMaxDistance,
  activeFilters,
  addRemoveFilter,
  resetFilters
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <div className="hidden">Trigger</div>
      </DrawerTrigger>
      <DrawerContent className="p-4 pb-8">
        <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-2"></div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Filtros</h3>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-purple-600 text-sm"
              onClick={resetFilters}
            >
              Limpar todos
            </Button>
          </div>
          
          {/* Disponibilidade */}
          <div>
            <h4 className="font-medium mb-2">Disponibilidade</h4>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={activeFilters.includes("today") ? "default" : "outline"} 
                size="sm"
                className={cn(
                  activeFilters.includes("today") ? "bg-purple-600" : "",
                  "rounded-full"
                )}
                onClick={() => addRemoveFilter("today")}
              >
                <Zap className={cn(
                  "h-3.5 w-3.5 mr-1",
                  !activeFilters.includes("today") && "text-purple-600"
                )} />
                Disponível hoje
              </Button>
              <Button 
                variant={activeFilters.includes("thisWeek") ? "default" : "outline"} 
                size="sm"
                className={cn(
                  activeFilters.includes("thisWeek") ? "bg-purple-600" : "",
                  "rounded-full"
                )}
                onClick={() => addRemoveFilter("thisWeek")}
              >
                <Calendar className={cn(
                  "h-3.5 w-3.5 mr-1",
                  !activeFilters.includes("thisWeek") && "text-purple-600"
                )} />
                Esta semana
              </Button>
            </div>
          </div>
          
          {/* Preço */}
          <div>
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">Preço</h4>
              <span className="text-sm">R${priceRange[0]} - R${priceRange[1]}</span>
            </div>
            <Slider 
              min={50}
              max={300}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>R$50</span>
              <span>R$300</span>
            </div>
          </div>
          
          {/* Distância */}
          <div>
            <div className="flex justify-between mb-2">
              <h4 className="font-medium">Distância máxima</h4>
              <span className="text-sm">{maxDistance} km</span>
            </div>
            <Slider 
              min={1}
              max={20}
              step={1}
              value={[maxDistance]}
              onValueChange={([value]) => setMaxDistance(value)}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>
          
          {/* Avaliação */}
          <div>
            <h4 className="font-medium mb-2">Avaliação</h4>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={activeFilters.includes("highRated") ? "default" : "outline"} 
                size="sm"
                className={cn(
                  activeFilters.includes("highRated") ? "bg-purple-600" : "",
                  "rounded-full"
                )}
                onClick={() => addRemoveFilter("highRated")}
              >
                <Star className={cn(
                  "h-3.5 w-3.5 mr-1",
                  activeFilters.includes("highRated") ? "text-yellow-300 fill-yellow-300" : "text-yellow-400"
                )} />
                4.8+
              </Button>
            </div>
          </div>
          
          <DrawerClose asChild>
            <Button className="w-full">
              Aplicar filtros
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
