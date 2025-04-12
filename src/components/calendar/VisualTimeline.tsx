
import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, Clock, AlertCircle, Check, Star, Users, 
  Clock3, ArrowLeft, ArrowRight, InfoIcon, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppointmentType {
  id: string;
  title: string;
  time: string;
  duration: number; // in minutes
  clientName?: string;
  clientImage?: string;
  type: "scheduled" | "free" | "buffer" | "blocked";
  status?: "confirmed" | "pending" | "completed";
  location?: "online" | "in-person";
  price?: number;
}

interface TimelineDay {
  date: Date;
  appointments: AppointmentType[];
}

interface VisualTimelineProps {
  initialDate?: Date;
  showBookingActions?: boolean;
}

const VisualTimeline: React.FC<VisualTimelineProps> = ({ 
  initialDate = new Date(),
  showBookingActions = true
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Generate a week of dates starting from currentDate
  const weekDates = [...Array(7)].map((_, i) => addDays(currentDate, i));
  
  // Mock appointments data - in a real app, this would come from an API
  const mockAppointmentsData: TimelineDay[] = weekDates.map(date => {
    // Generate different appointments for each day
    const dayAppointments: AppointmentType[] = [];
    
    // Working hours from 8 AM to 6 PM
    const workHours = [...Array(10)].map((_, i) => `${8 + i}:00`);
    
    // For demonstration, create different appointment types
    workHours.forEach(time => {
      // Randomly determine if this slot has an appointment
      const rand = Math.random();
      
      if (rand < 0.3) {
        // 30% chance of scheduled appointment
        dayAppointments.push({
          id: `appt-${date.toISOString()}-${time}`,
          title: "Consultoria de Software",
          time,
          duration: 60,
          clientName: rand < 0.15 ? "Maria Silva" : "João Santos",
          clientImage: rand < 0.15 
            ? "https://randomuser.me/api/portraits/women/33.jpg" 
            : "https://randomuser.me/api/portraits/men/54.jpg",
          type: "scheduled",
          status: rand < 0.1 ? "completed" : (rand < 0.2 ? "confirmed" : "pending"),
          location: rand < 0.15 ? "in-person" : "online",
          price: Math.floor(rand * 50) + 150
        });
      } else if (rand < 0.4) {
        // 10% chance of blocked time
        dayAppointments.push({
          id: `blocked-${date.toISOString()}-${time}`,
          title: "Indisponível",
          time,
          duration: 60,
          type: "blocked"
        });
      } else if (rand < 0.5) {
        // 10% chance of buffer time
        dayAppointments.push({
          id: `buffer-${date.toISOString()}-${time}`,
          title: "Intervalo",
          time,
          duration: 60,
          type: "buffer"
        });
      } else {
        // 50% chance of free time slot
        dayAppointments.push({
          id: `free-${date.toISOString()}-${time}`,
          title: "Disponível",
          time,
          duration: 60,
          type: "free"
        });
      }
    });
    
    return {
      date,
      appointments: dayAppointments
    };
  });
  
  const navigatePrevWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const navigateNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const getDayAppointments = (date: Date) => {
    return mockAppointmentsData.find(day => 
      isSameDay(day.date, date)
    )?.appointments || [];
  };
  
  const handleDaySelect = (date: Date) => {
    setCurrentDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time === selectedTime ? null : time);
  };
  
  const getAppointmentColor = (type: AppointmentType["type"], status?: AppointmentType["status"]) => {
    switch (type) {
      case "scheduled":
        if (status === "completed") return "bg-gray-100 border-gray-200";
        if (status === "pending") return "bg-amber-50 border-amber-200";
        return "bg-blue-50 border-blue-200";
      case "free": 
        return "bg-green-50 border-green-200";
      case "buffer":
        return "bg-purple-50 border-purple-200";
      case "blocked":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Timeline header with navigation */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Calendário</h3>
          <p className="text-sm text-gray-500">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={navigatePrevWeek}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={navigateNextWeek}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Week days selector */}
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
              onClick={() => handleDaySelect(date)}
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
      
      {/* Appointments for the selected day */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium">
            {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h4>
        </div>
        
        {/* Time slots */}
        <div className="space-y-3">
          {getDayAppointments(currentDate).map(appointment => {
            const isSelected = appointment.time === selectedTime;
            const isAvailable = appointment.type === "free";
            
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "border rounded-lg p-3 transition-all",
                  getAppointmentColor(appointment.type, appointment.status),
                  isSelected && "ring-2 ring-purple-400",
                  isAvailable && showBookingActions && "cursor-pointer hover:border-purple-300"
                )}
                onClick={() => {
                  if (isAvailable && showBookingActions) {
                    handleTimeSelect(appointment.time);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">
                        {appointment.time} - {appointment.time.split(':')[0]}:{parseInt(appointment.time.split(':')[0]) + 1}:00
                      </p>
                      <p className="text-sm text-gray-600">{appointment.title}</p>
                    </div>
                  </div>
                  
                  {appointment.type === "scheduled" && (
                    <div className="flex items-center">
                      {appointment.status === "pending" && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center">
                          <Clock3 className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                      {appointment.status === "confirmed" && (
                        <Badge className="bg-green-100 text-green-700 border-0 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Confirmado
                        </Badge>
                      )}
                      {appointment.status === "completed" && (
                        <Badge className="bg-gray-100 text-gray-700 border-0 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {appointment.type === "free" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Horário disponível para agendamento</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                {/* Client information for scheduled appointments */}
                {appointment.type === "scheduled" && appointment.clientName && (
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                        <img 
                          src={appointment.clientImage} 
                          alt={appointment.clientName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{appointment.clientName}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          {appointment.location === "online" ? (
                            <span>Consulta online</span>
                          ) : (
                            <span>Presencial</span>
                          )}
                          {appointment.price && (
                            <>
                              <span className="mx-1">•</span>
                              <span>R${appointment.price}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Selection UI for available time slots */}
                {isAvailable && isSelected && showBookingActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm">
                        <AlertCircle className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="text-purple-700 font-medium">Horário disponível</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Valor</p>
                        <p className="font-semibold text-purple-700">R$180</p>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar este horário
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisualTimeline;
