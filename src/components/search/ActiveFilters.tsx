
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ActiveFiltersProps {
  priceRange: [number, number];
  maxDistance: number;
  activeFilters: string[];
  resetFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  priceRange,
  maxDistance,
  activeFilters,
  resetFilters
}) => {
  if (
    priceRange[0] === 0 &&
    priceRange[1] === 500 &&
    maxDistance === 10 &&
    activeFilters.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2" data-testid="active-filters">
      {priceRange[0] > 0 || priceRange[1] < 500 ? (
        <Badge variant="outline" className="flex items-center gap-1">
          R${priceRange[0]} - R${priceRange[1]}
          <X className="h-3 w-3 cursor-pointer" />
        </Badge>
      ) : null}

      {maxDistance !== 10 ? (
        <Badge variant="outline" className="flex items-center gap-1">
          Até {maxDistance}km
          <X className="h-3 w-3 cursor-pointer" />
        </Badge>
      ) : null}

      {activeFilters.includes("today") && (
        <Badge variant="outline" className="flex items-center gap-1">
          Disponível hoje
          <X className="h-3 w-3 cursor-pointer" />
        </Badge>
      )}

      {activeFilters.includes("highRated") && (
        <Badge variant="outline" className="flex items-center gap-1">
          Bem avaliados
          <X className="h-3 w-3 cursor-pointer" />
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground"
        onClick={resetFilters}
      >
        Limpar filtros
      </Button>
    </div>
  );
};

export default ActiveFilters;
