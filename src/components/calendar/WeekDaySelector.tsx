
import React from "react";
import { isSameDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TimelineDay } from "./types";

interface WeekDaySelectorProps {
  weekDates: Date[];
  currentDate: Date;
  onDaySelect: (date: Date) => void;
  mockAppointmentsData: TimelineDay[];
}

const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  weekDates,
  currentDate,
  onDaySelect,
  mockAppointmentsData,
}) => {
  const getDayAppointments = (date: Date) => {
    return mockAppointmentsData.find(day => 
      isSameDay(day.date, date)
    )?.appointments || [];
  };

  return (
    <div className="flex border-b overflow-x-auto">
      {weekDates.map(date => {
        const isCurrentDay = isSameDay(date, currentDate);
        const dayAppointments = getDayAppointments(date);
        const hasAvailability = dayAppointments.some(apt => apt.type === "free");
        
        return (
          <button
            key={date.toISOString()}
            className={cn(
              "flex-1 min-w-[100px] p-3 text-center border-r last:border-r-0 transition-colors",
              isCurrentDay 
                ? "bg-purple-50 border-b-2 border-b-purple-500" 
                : "hover:bg-gray-50"
            )}
            onClick={() => onDaySelect(date)}
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
