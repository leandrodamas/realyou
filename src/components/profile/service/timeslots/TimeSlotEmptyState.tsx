
import React from "react";
import { Calendar, AlertCircle } from "lucide-react";

interface TimeSlotEmptyStateProps {
  selectedDate: Date | undefined;
  hasSlots: boolean;
}

const TimeSlotEmptyState: React.FC<TimeSlotEmptyStateProps> = ({
  selectedDate,
  hasSlots
}) => {
  if (selectedDate && !hasSlots) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
        <p className="text-gray-500 text-center">
          Não há horários disponíveis para esta data.<br/>
          Por favor, selecione outra data.
        </p>
      </div>
    );
  }
  
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Calendar className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-gray-500">
          Selecione uma data para ver os horários disponíveis
        </p>
      </div>
    );
  }
  
  return null;
};

export default TimeSlotEmptyState;
