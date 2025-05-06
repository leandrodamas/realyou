
import React from "react";
import { User, CreditCard, MoreVertical, Video, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppointmentType } from "../types";
import LocationBadge from "./LocationBadge";

interface ClientInfoProps {
  appointment: AppointmentType;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ appointment }) => {
  if (
    appointment.type !== "scheduled" || 
    (!appointment.client?.name && !appointment.clientName)
  ) return null;

  // Determine client name and image using either the client object or direct properties
  const clientName = appointment.client?.name || appointment.clientName || "Cliente";
  const clientImage = appointment.client?.avatar || appointment.clientImage || "";
  
  return (
    <div className="mt-3 pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
            <img 
              src={clientImage} 
              alt={clientName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{clientName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <User className="h-3 w-3" />
              <span>Cliente</span>
              {appointment.location && (
                <>
                  <span className="mx-1">•</span>
                  <LocationBadge location={appointment.location} />
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
  );
};

export default ClientInfo;
