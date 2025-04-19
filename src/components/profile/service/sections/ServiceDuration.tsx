
import React from "react";
import { Clock } from "lucide-react";

const ServiceDuration = () => {
  return (
    <div className="flex items-center">
      <Clock className="h-5 w-5 text-purple-600 mr-3" />
      <div>
        <h4 className="font-medium">Duração</h4>
        <p className="text-gray-600">1 hora</p>
      </div>
    </div>
  );
};

export default ServiceDuration;
