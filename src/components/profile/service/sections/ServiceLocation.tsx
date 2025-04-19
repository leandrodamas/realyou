
import React from "react";
import { MapPin } from "lucide-react";

const ServiceLocation = () => {
  return (
    <div className="flex items-center">
      <MapPin className="h-5 w-5 text-red-500 mr-3" />
      <div>
        <h4 className="font-medium">Local</h4>
        <p className="text-gray-600">Online (via chamada de vídeo)</p>
      </div>
    </div>
  );
};

export default ServiceLocation;
