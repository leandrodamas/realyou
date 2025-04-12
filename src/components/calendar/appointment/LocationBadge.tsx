
import React from "react";
import { Video, MapPin } from "lucide-react";
import { AppointmentType } from "../types";

interface LocationBadgeProps {
  location: AppointmentType["location"];
}

const LocationBadge: React.FC<LocationBadgeProps> = ({ location }) => {
  if (!location) return null;
  
  return (
    <span className="flex items-center">
      {location === "online" ? (
        <Video className="h-3.5 w-3.5 text-blue-500 mr-1" />
      ) : (
        <MapPin className="h-3.5 w-3.5 text-purple-500 mr-1" />
      )}
      <span>
        {location === "online" ? "Online" : "Presencial"}
      </span>
    </span>
  );
};

export default LocationBadge;
