
import React from "react";
import { Calendar, Users, Map, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const TimelineTabs: React.FC = () => {
  return (
    <div className="bg-white border-b">
      <div className="flex p-2 overflow-x-auto">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Agenda</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Clientes</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
        >
          <Map className="h-4 w-4" />
          <span>Mapa</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
        >
          <Star className="h-4 w-4" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  );
};

export default TimelineTabs;
