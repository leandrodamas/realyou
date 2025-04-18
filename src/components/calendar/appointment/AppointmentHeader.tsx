
import React from "react";
import { Clock, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AppointmentStatus from "./AppointmentStatus";
import { AppointmentType } from "../types";

interface AppointmentHeaderProps {
  appointment: AppointmentType;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({ appointment }) => {
  return (
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
      
      {appointment.type === "scheduled" && <AppointmentStatus status={appointment.status} />}
      
      {appointment.type === "free" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Horário disponível para agendamento</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default AppointmentHeader;
