
import React from "react";
import { Clock3, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppointmentType } from "../types";

interface AppointmentStatusProps {
  status?: AppointmentType["status"];
}

const AppointmentStatus: React.FC<AppointmentStatusProps> = ({ status }) => {
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

export default AppointmentStatus;
