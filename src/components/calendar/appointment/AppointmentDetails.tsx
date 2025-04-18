
import React from "react";
import { ChevronDown, Users, Clock, Calendar, File, MessagesSquare } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { AppointmentType } from "../types";
import { cn } from "@/lib/utils";

interface AppointmentDetailsProps {
  appointment: AppointmentType;
  isOpen: boolean;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ 
  appointment,
  isOpen
}) => {
  // Return null if it's not a scheduled appointment
  if (appointment.type !== "scheduled") return null;
  
  return (
    <Collapsible open={isOpen} className="mt-3 pt-2 border-t border-gray-100">
      <CollapsibleTrigger asChild className="w-full">
        <div className="flex items-center justify-center w-full cursor-pointer pt-1">
          <ChevronDown className={cn(
            "h-5 w-5 text-gray-500 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        {/* Duration & Service Type */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Duração: {appointment.duration} minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Serviço: {appointment.title}</span>
          </div>
        </div>
        
        {/* Notes & Actions */}
        <div className="border-t border-gray-100 pt-2">
          <p className="text-xs text-gray-500 mb-2">Notas do agendamento:</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
            {appointment.notes || "Nenhuma nota adicional para este agendamento."}
          </p>
          
          <div className="flex gap-2 mt-3">
            <button className="flex items-center gap-1 text-xs py-1 px-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
              <Calendar className="h-3.5 w-3.5" />
              <span>Reagendar</span>
            </button>
            <button className="flex items-center gap-1 text-xs py-1 px-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
              <MessagesSquare className="h-3.5 w-3.5" />
              <span>Mensagem</span>
            </button>
            <button className="flex items-center gap-1 text-xs py-1 px-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 ml-auto">
              <File className="h-3.5 w-3.5" />
              <span>Ver histórico</span>
            </button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AppointmentDetails;
