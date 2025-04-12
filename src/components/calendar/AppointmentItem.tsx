
import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, AlertCircle, Check, Clock3,
  Calendar, InfoIcon, MoreVertical,
  Video, MapPin, Phone, User, CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppointmentType } from "./types";

interface AppointmentItemProps {
  appointment: AppointmentType;
  isSelected: boolean;
  showBookingActions: boolean;
  onTimeSelect: (time: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment, 
  isSelected, 
  showBookingActions,
  onTimeSelect
}) => {
  const isAvailable = appointment.type === "free";
  
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
  
  const getLocationIcon = (location?: string) => {
    if (!location) return null;
    
    switch (location) {
      case "online":
        return <Video className="h-3.5 w-3.5 text-blue-500" />;
      case "in-person":
        return <MapPin className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: AppointmentType["status"]) => {
    if (!status) return null;
    
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center">
            <Clock3 className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 border-0 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Confirmado
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-0 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      default:
        return null;
    }
  };

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
          onTimeSelect(appointment.time);
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
        
        {appointment.type === "scheduled" && getStatusBadge(appointment.status)}
        
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
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <User className="h-3 w-3" />
                  <span>Cliente</span>
                  {appointment.location && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="flex items-center">
                        {getLocationIcon(appointment.location)}
                        <span className="ml-1">
                          {appointment.location === "online" ? "Online" : "Presencial"}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {appointment.price && (
                <Badge variant="outline" className="bg-green-50 text-green-700 flex gap-1 items-center">
                  <CreditCard className="h-3 w-3" />
                  <span>R${appointment.price}</span>
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Phone className="h-3 w-3" />
              <span>Contatar</span>
            </Button>
            {appointment.location === "online" && (
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                <Video className="h-3 w-3" />
                <span>Link da reunião</span>
              </Button>
            )}
          </div>
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
};

export default AppointmentItem;
