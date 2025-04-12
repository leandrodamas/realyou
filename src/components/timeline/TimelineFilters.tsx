
import React, { useState } from "react";
import { ChevronDown, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AppointmentType } from "../calendar/types";

interface TimelineFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointmentFilters?: string[];
  onFiltersChange?: (filters: string[]) => void;
}

const TimelineFilters: React.FC<TimelineFiltersProps> = ({ 
  selectedDate, 
  onDateChange,
  appointmentFilters = ["scheduled", "free", "buffer", "blocked"],
  onFiltersChange 
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(appointmentFilters);

  const handleFilterChange = (type: string, checked: boolean) => {
    const newFilters = checked 
      ? [...selectedFilters, type] 
      : selectedFilters.filter(filter => filter !== type);
    
    setSelectedFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="bg-white p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-3">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Tipos de Agendamento</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="scheduled" 
                    checked={selectedFilters.includes("scheduled")}
                    onCheckedChange={(checked) => handleFilterChange("scheduled", checked === true)}
                  />
                  <label htmlFor="scheduled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Agendados
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="free" 
                    checked={selectedFilters.includes("free")}
                    onCheckedChange={(checked) => handleFilterChange("free", checked === true)}
                  />
                  <label htmlFor="free" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Disponíveis
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="buffer" 
                    checked={selectedFilters.includes("buffer")}
                    onCheckedChange={(checked) => handleFilterChange("buffer", checked === true)}
                  />
                  <label htmlFor="buffer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Intervalos
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="blocked" 
                    checked={selectedFilters.includes("blocked")}
                    onCheckedChange={(checked) => handleFilterChange("blocked", checked === true)}
                  />
                  <label htmlFor="blocked" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Bloqueados
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
