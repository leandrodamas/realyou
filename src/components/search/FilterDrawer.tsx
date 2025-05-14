
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onOpenChange,
  priceRange,
  setPriceRange,
  maxDistance,
  setMaxDistance,
  activeFilters,
  setActiveFilters,
}) => {
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(
      activeFilters.includes(filterId)
        ? activeFilters.filter((id) => id !== filterId)
        : [...activeFilters, filterId]
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Faixa de preço</h3>
            <div className="mb-2 flex justify-between">
              <span>R${priceRange[0]}</span>
              <span>R${priceRange[1]}</span>
            </div>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={500}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="py-2"
            />
          </div>

          <div className="mb-6">
            <h3 className="mb-2 font-medium">Distância máxima</h3>
            <div className="mb-2 flex justify-between">
              <span>1km</span>
              <span>{maxDistance}km</span>
            </div>
            <Slider
              defaultValue={[maxDistance]}
              min={1}
              max={20}
              step={1}
              value={[maxDistance]}
              onValueChange={(value) => setMaxDistance(value[0])}
              className="py-2"
            />
          </div>

          <div className="mb-6 space-y-3">
            <h3 className="font-medium">Outros filtros</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="today"
                checked={activeFilters.includes("today")}
                onCheckedChange={() => handleFilterToggle("today")}
              />
              <Label htmlFor="today">Disponível hoje</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highRated"
                checked={activeFilters.includes("highRated")}
                onCheckedChange={() => handleFilterToggle("highRated")}
              />
              <Label htmlFor="highRated">Bem avaliados (4.8+)</Label>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={() => onOpenChange(false)}>Aplicar filtros</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
