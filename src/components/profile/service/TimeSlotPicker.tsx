
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-600" />
          Horários disponíveis
          {selectedDate ? (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedDate ? (
          <div>
            <div className="grid grid-cols-4 gap-2">
              {availableTimeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "h-10",
                    selectedTime === time && "bg-purple-600 hover:bg-purple-700"
                  )}
                  onClick={() => onTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                onClick={onSchedule} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
              >
                Solicitar Agendamento
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Info className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">Selecione uma data para ver os horários disponíveis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;
