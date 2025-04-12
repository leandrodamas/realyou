
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Info, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [viewingUsers, setViewingUsers] = useState<{[key: string]: number}>({
    "08:00": 2,
    "09:00": 3,
    "14:00": 1,
  });
  
  const handleScheduleClick = () => {
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário");
      return;
    }
    onSchedule();
  };

  const getTimeslotDemand = (time: string): "high" | "medium" | "low" => {
    const viewers = viewingUsers[time] || 0;
    if (viewers >= 3) return "high";
    if (viewers >= 1) return "medium";
    return "low";
  };

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
              {availableTimeSlots.map((time) => {
                const demand = getTimeslotDemand(time);
                return (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "h-10 relative",
                    selectedTime === time && "bg-purple-600 hover:bg-purple-700"
                  )}
                  onClick={() => onTimeSelect(time)}
                >
                  {time}
                  {demand === "high" && (
                    <div className="absolute -top-1 -right-1">
                      <div className="flex items-center bg-red-500 text-white text-[10px] rounded-full px-1 animate-pulse">
                        <Users className="h-2 w-2 mr-0.5" />
                        {viewingUsers[time]}
                      </div>
                    </div>
                  )}
                </Button>
              )})}
            </div>
            
            {/* Urgent booking indicator */}
            <div className="mt-3 mb-4">
              {viewingUsers["08:00"] > 0 && (
                <div className="flex items-center text-xs text-amber-600 animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>3 pessoas estão vendo estes horários agora!</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={handleScheduleClick} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] font-medium"
                size="lg"
              >
                Agendar Agora
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-2">
                Cancelamento gratuito até 24h antes
              </p>
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
