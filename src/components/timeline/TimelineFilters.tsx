
import React, { useState } from "react";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const TimelineFilters: React.FC<TimelineFiltersProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className="bg-white p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <span>Todos</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
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
