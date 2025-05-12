
import React from "react";
import { isSameDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WeekDaySelectorProps, AppointmentType } from "./types";

const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  weekDates,
  currentDate,
  onDaySelect,
  appointments,
}) => {
  // Check if a day has any free appointments
  const hasFreeAppointment = (date: Date) => {
    if (!appointments || appointments.length === 0) return false;
    
    return appointments.some(appointment => 
      appointment && 
      appointment.date && 
      isSameDay(appointment.date, date) && 
      appointment.type === "free"
    );
  };

  return (
    <div className="flex border-b overflow-x-auto">
      {weekDates.map(date => {
        const isCurrentDay = isSameDay(date, currentDate);
        const hasAvailability = hasFreeAppointment(date);
        
        return (
          <button
            key={date.toISOString()}
            className={cn(
              "flex-1 min-w-[100px] p-3 text-center border-r last:border-r-0 transition-colors",
              isCurrentDay 
                ? "bg-purple-50 border-b-2 border-b-purple-500" 
                : "hover:bg-gray-50"
            )}
            onClick={() => {
              console.log("Day selected:", format(date, "yyyy-MM-dd"));
              onDaySelect(date);
            }}
          >
            <p className="text-xs uppercase text-gray-500">
              {format(date, "EEE", { locale: ptBR })}
            </p>
            <p className={cn(
              "text-lg font-medium",
              isCurrentDay && "text-purple-700"
            )}>
              {format(date, "dd")}
            </p>
            {hasAvailability && (
              <Badge 
                variant="outline" 
                size="sm" 
                className="mt-1 bg-green-50 text-green-700 border-green-200"
              >
                Disponível
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WeekDaySelector;
