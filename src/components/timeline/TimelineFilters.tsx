
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimelineFilters: React.FC = () => {
  return (
    <div className="bg-white p-4 border-b flex justify-between items-center">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <span>Todos</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
        >
          Dia
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="text-xs bg-purple-600"
        >
          Semana
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
        >
          Mês
        </Button>
      </div>
    </div>
  );
};

export default TimelineFilters;
