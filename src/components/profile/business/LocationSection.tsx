
import React from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationSectionProps {
  location: string;
  isEditing?: boolean;
  onLocationChange?: (value: string) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  location,
  isEditing = false,
  onLocationChange
}) => {
  return (
    <div className="flex space-x-3">
      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
        <MapPin className="h-4 w-4 text-purple-600" />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={location}
            onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
            placeholder="Sua localização"
            className="h-8 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-500">{location}</p>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
