
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Check, Zap, TrendingUp, Users } from "lucide-react";
import { format, isSameDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ServiceDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const ServiceDatePicker: React.FC<ServiceDatePickerProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  // Gerar datas disponíveis para os próximos 10 dias
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [urgentDates, setUrgentDates] = useState<Date[]>([]);
  const [highDemandDates, setHighDemandDates] = useState<Date[]>([]);
  
  useEffect(() => {
    // Gerar datas disponíveis para os próximos 10 dias (excluindo alguns dias aleatoriamente)
    const dates: Date[] = [];
    const urgents: Date[] = [];
    const highDemand: Date[] = [];
    
    for (let i = 1; i <= 14; i++) {
      // Pular 2-3 dias para simular indisponibilidade
      if (i % 3 !== 0) {
        const date = addDays(new Date(), i);
        dates.push(date);
        
        // Adicionar alguns dias como urgentes (disponibilidade imediata)
        if (i <= 2) {
          urgents.push(date);
        }
        
        // Adicionar alguns dias como alta demanda (preço dinâmico)
        if (i === 3 || i === 6 || i === 10) {
          highDemand.push(date);
        }
      }
    }
    
    setAvailableDates(dates);
    setUrgentDates(urgents);
    setHighDemandDates(highDemand);
  }, []);
  
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
  
  const isHighDemandDate = (date: Date) => {
    return highDemandDates.some(highDemandDate => 
      isSameDay(highDemandDate, date)
    );
  };
  
  // Número de pessoas que estão visualizando o calendário agora
  const [viewerCount, setViewerCount] = useState(0);
  
  useEffect(() => {
    // Gerar um número aleatório de visualizadores entre 1 e 4
    setViewerCount(Math.floor(Math.random() * 4) + 1);
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 4) + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
            Selecione uma data
          </CardTitle>
          {viewerCount > 0 && (
            <Badge variant="outline" className="bg-purple-50 border-purple-100 text-purple-700">
              <Users className="h-3 w-3 mr-1" />
              {viewerCount} online
            </Badge>
          )}
        </div>
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
            urgent: (date) => isUrgentDate(date),
            highDemand: (date) => isHighDemandDate(date)
          }}
          modifiersClassNames={{
            urgent: "bg-amber-50 text-amber-900 font-medium",
            highDemand: "bg-rose-50 text-rose-900 font-medium"
          }}
          components={{
            DayContent: (props) => {
              const isUrgent = isUrgentDate(props.date);
              const isHighDemand = isHighDemandDate(props.date);
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div>{props.date.getDate()}</div>
                  {isUrgent && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="h-1 w-5 bg-amber-500 rounded-full"></div>
                    </div>
                  )}
                  {isHighDemand && (
                    <div className="absolute top-0 right-0">
                      <TrendingUp className="h-3 w-3 text-rose-500" />
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
          <Badge variant="outline" className="bg-rose-50 border-rose-200">
            <TrendingUp className="h-3 w-3 text-rose-500 mr-1" />
            Preço dinâmico (+20%)
          </Badge>
        </div>
        
        {selectedDate && (
          <motion.div 
            className="mt-3 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-purple-700 font-medium">
              {isUrgentDate(selectedDate) ? (
                <span className="flex items-center justify-center">
                  <Check className="h-3 w-3 mr-1" />
                  Disponibilidade confirmada para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              ) : isHighDemandDate(selectedDate) ? (
                <span className="flex items-center justify-center text-rose-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Alta demanda em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} (preço dinâmico)
                </span>
              ) : (
                <span>
                  Data selecionada: {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceDatePicker;
