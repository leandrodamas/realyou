
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Clock, Star } from "lucide-react";

interface ActiveFiltersProps {
  priceRange: number[];
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
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-2 border-b flex items-center gap-2 overflow-x-auto scrollbar-none">
      <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
        <DollarSign className="h-3 w-3" />
        R${priceRange[0]} - R${priceRange[1]}
      </Badge>
      <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
        <MapPin className="h-3 w-3" />
        Até {maxDistance}km
      </Badge>
      {activeFilters.includes("today") && (
        <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
          <Clock className="h-3 w-3" />
          Hoje
        </Badge>
      )}
      {activeFilters.includes("highRated") && (
        <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
          <Star className="h-3 w-3" />
          4.8+
        </Badge>
      )}
      <Button 
        variant="ghost" 
        className="text-xs text-gray-500 p-0 h-auto"
        onClick={resetFilters}
      >
        Limpar
      </Button>
    </div>
  );
};

export default ActiveFilters;
