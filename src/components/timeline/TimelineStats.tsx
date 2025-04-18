
import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TimelineStats: React.FC = () => {
  return (
    <div className="bg-white p-4 border-b">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Próximos agendamentos</p>
          <p className="text-xl font-semibold">6 esta semana</p>
        </div>
        
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-0">
            <span>Hoje: 2</span>
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>4 novos clientes</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TimelineStats;
