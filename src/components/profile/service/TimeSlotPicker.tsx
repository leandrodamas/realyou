
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar } from "lucide-react";
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
  const [viewingUsers, setViewingUsers] = useState<{[key: string]: number}>({
    "08:00": 2,
    "09:00": 3,
    "14:00": 1,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Horários disponíveis
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDate ? (
          <div>
            <div className="grid grid-cols-4 gap-2">
              {availableTimeSlots.map((time) => {
                const viewers = viewingUsers[time] || 0;
                const isHighDemand = viewers >= 3;
                
                return (
                  <div key={time} className="relative">
                    <Button
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "h-10 w-full relative",
                        selectedTime === time && "bg-purple-600 hover:bg-purple-700"
                      )}
                      onClick={() => onTimeSelect(time)}
                    >
                      {time}
                      {isHighDemand && (
                        <div className="absolute -top-1 -right-1">
                          <div className="flex items-center bg-red-500 text-white text-[10px] rounded-full px-1 animate-pulse">
                            {viewers}
                          </div>
                        </div>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {viewingUsers["08:00"] > 0 && (
              <div className="mt-3">
                <div className="flex items-center text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>3 pessoas estão vendo estes horários agora!</span>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={onSchedule} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
                disabled={!selectedTime}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Agora
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Cancelamento gratuito até 24h antes
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Calendar className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-gray-500">
              Selecione uma data para ver os horários disponíveis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;
