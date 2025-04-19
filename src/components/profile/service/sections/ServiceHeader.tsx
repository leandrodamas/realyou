
import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ServiceHeader = ({ rating = 4.9 }: { rating?: number }) => {
  return (
    <div className="flex items-center justify-between">
      <span>Informações do Serviço</span>
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
        {rating}
      </Badge>
    </div>
  );
};

export default ServiceHeader;
