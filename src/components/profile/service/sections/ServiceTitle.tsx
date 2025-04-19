
import React from "react";
import { Award, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ServiceTitle = () => {
  return (
    <div className="flex items-start">
      <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
      <div>
        <h4 className="font-medium">Consultoria de Software</h4>
        <div className="flex flex-wrap gap-1 mt-1">
          <p className="text-xs text-gray-500">Superstar • Escolha da Semana</p>
          <Badge variant="outline" className="text-[10px] border-purple-200 bg-purple-50 text-purple-700">
            <ThumbsUp className="h-2.5 w-2.5 mr-0.5" />
            98% de aprovação
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;
