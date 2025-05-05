
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  
  const [realTimeViewers, setRealTimeViewers] = useState<number>(0);
  
  // Simular visualizações em tempo real quando a data é selecionada
  useEffect(() => {
    if (selectedDate) {
      setRealTimeViewers(Math.floor(Math.random() * 5) + 1);
      
      // Atualizar visualizadores simulados a cada 10-20 segundos
      const interval = setInterval(() => {
        setRealTimeViewers(Math.floor(Math.random() * 5) + 1);
      }, Math.random() * 10000 + 10000);
      
      return () => clearInterval(interval);
    } else {
      setRealTimeViewers(0);
    }
  }, [selectedDate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Horários disponíveis
          </CardTitle>
          
          {realTimeViewers > 0 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1"
            >
              <Users className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-purple-600">
                {realTimeViewers} {realTimeViewers === 1 ? 'pessoa' : 'pessoas'} online
              </span>
            </motion.div>
          )}
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
                        selectedTime === time && "bg-purple-600 hover:bg-purple-700",
                        isHighDemand && "border-amber-300"
                      )}
                      onClick={() => onTimeSelect(time)}
                    >
                      {time}
                      {isHighDemand && (
                        <div className="absolute -top-1 -right-1">
                          <div className="flex items-center bg-red-500 text-white text-[10px] rounded-full px-1 animate-pulse">
                            <Users className="h-2 w-2 mr-0.5" />
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
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>{Math.max(...Object.values(viewingUsers))} pessoas estão vendo estes horários agora!</span>
                </div>
              </motion.div>
            )}
            
            <div className="mt-4 space-y-2">
              <Button 
                onClick={onSchedule} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
                disabled={!selectedTime}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Agora
              </Button>
              
              <Badge variant="outline" className="w-full flex justify-center text-xs text-green-700 bg-green-50 border-green-100">
                Cancelamento gratuito até 24h antes
              </Badge>
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
