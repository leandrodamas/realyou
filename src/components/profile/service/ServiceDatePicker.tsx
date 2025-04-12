
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Check } from "lucide-react";
import { format, isSameDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ServiceDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const ServiceDatePicker: React.FC<ServiceDatePickerProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  // Mock data - in a real app this would come from an API
  const availableDates = [
    addDays(new Date(), 1),
    addDays(new Date(), 2),
    addDays(new Date(), 3),
    addDays(new Date(), 5),
    addDays(new Date(), 7),
  ];
  
  const urgentDates = [
    addDays(new Date(), 1),
  ];
  
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      isSameDay(availableDate, date)
    );
  };
  
  const isUrgentDate = (date: Date) => {
    return urgentDates.some(urgentDate => 
      isSameDay(urgentDate, date)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
          Selecione uma data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border pointer-events-auto"
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || !isDateAvailable(date);
          }}
          modifiers={{
            urgent: (date) => isUrgentDate(date)
          }}
          modifiersClassNames={{
            urgent: "bg-amber-50 text-amber-900 font-medium"
          }}
          components={{
            DayContent: (props) => {
              const isUrgent = isUrgentDate(props.date);
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {props.children}
                  {isUrgent && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-5 bg-amber-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        <div className="flex flex-wrap gap-1 mt-4 text-xs">
          <Badge variant="outline" className="bg-white">
            <div className="h-2 w-2 bg-purple-600 rounded-full mr-1"></div>
            Disponível
          </Badge>
          <Badge variant="outline" className="bg-amber-50 border-amber-200">
            <div className="h-2 w-2 bg-amber-500 rounded-full mr-1"></div>
            Disponibilidade urgente
          </Badge>
        </div>
        
        {selectedDate && (
          <div className="mt-3 text-center">
            <p className="text-xs text-purple-700 font-medium">
              {isUrgentDate(selectedDate) ? (
                <span className="flex items-center justify-center">
                  <Check className="h-3 w-3 mr-1" />
                  Disponibilidade confirmada para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              ) : (
                <span>
                  Data selecionada: {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceDatePicker;
