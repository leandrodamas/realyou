
import React from "react";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CalendarLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-1 mt-4 text-xs">
      <Badge variant="outline" className="bg-white">
        <div className="h-2 w-2 bg-purple-600 rounded-full mr-1"></div>
        Disponível
      </Badge>
      <Badge variant="outline" className="bg-amber-50 border-amber-200">
        <div className="h-2 w-2 bg-amber-500 rounded-full mr-1"></div>
        Disponibilidade urgente
      </Badge>
      <Badge variant="outline" className="bg-rose-50 border-rose-200">
        <TrendingUp className="h-3 w-3 text-rose-500 mr-1" />
        Preço dinâmico (+20%)
      </Badge>
    </div>
  );
};

export default CalendarLegend;
