
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Users, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
  providerId?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
  providerId
}) => {
  const [viewingUsers, setViewingUsers] = useState<{[key: string]: number}>({});
  const [realTimeViewers, setRealTimeViewers] = useState<number>(0);
  const [slots, setSlots] = useState<string[]>(availableTimeSlots);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar horários disponíveis reais do provedor
  useEffect(() => {
    if (!selectedDate || !providerId) return;
    
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const dayOfWeek = selectedDate.getDay(); // 0-6, sendo 0 = domingo
        
        // Buscar horários configurados pelo provedor para este dia da semana
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('service_schedules')
          .select('*')
          .eq('user_id', providerId)
          .eq('day_of_week', dayOfWeek)
          .eq('is_available', true);
        
        if (schedulesError) throw schedulesError;
        
        // Buscar agendamentos já confirmados para esta data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('*')
          .eq('provider_id', providerId)
          .eq('booking_date', dateStr)
          .in('status', ['confirmed', 'pending']);
        
        if (bookingsError) throw bookingsError;
        
        // Se não há configuração para este dia, usar os horários padrão
        if (!schedulesData || schedulesData.length === 0) {
          // Usar os horários padrão
          setSlots(availableTimeSlots);
        } else {
          // Gerar slots baseados na configuração do provedor
          const allSlots: string[] = [];
          
          schedulesData.forEach(schedule => {
            // Converter hora de início e fim para minutos
            const startParts = schedule.start_time.split(':').map(Number);
            const endParts = schedule.end_time.split(':').map(Number);
            
            const startMinutes = startParts[0] * 60 + startParts[1];
            const endMinutes = endParts[0] * 60 + endParts[1];
            
            // Gerar slots de hora em hora
            for (let mins = startMinutes; mins < endMinutes; mins += 60) {
              const hours = Math.floor(mins / 60);
              const formattedHours = hours.toString().padStart(2, '0');
              allSlots.push(`${formattedHours}:00`);
            }
          });
          
          // Remover horários já agendados
          const bookedTimes = (bookingsData || []).map(booking => 
            booking.start_time.substring(0, 5)
          );
          
          const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
          setSlots(availableSlots);
        }
        
        // Simular visualizações para alguns horários
        const viewings: {[key: string]: number} = {};
        if (slots.length > 0) {
          // Atribuir visualizadores aleatórios para alguns slots
          const randomSlots = [...slots].sort(() => 0.5 - Math.random()).slice(0, 3);
          randomSlots.forEach(slot => {
            viewings[slot] = Math.floor(Math.random() * 3) + 1;
          });
        }
        setViewingUsers(viewings);
        
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        // Fallback para slots padrão
        setSlots(availableTimeSlots);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
    
  }, [selectedDate, providerId, availableTimeSlots]);
  
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader className="h-6 w-6 text-purple-600 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Carregando horários...</p>
          </div>
        ) : selectedDate ? (
          <div>
            {slots.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((time) => {
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
                
                {Object.values(viewingUsers).some(count => count > 0) && (
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-gray-500 text-center">
                  Não há horários disponíveis para esta data.<br/>
                  Por favor, selecione outra data.
                </p>
              </div>
            )}
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
