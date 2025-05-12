
import React from "react";
import { Calendar, Users, Map, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TimelineTabs: React.FC = () => {
  // Handle tab clicks
  const handleTabClick = (tabName: string) => {
    console.log(`Timeline Tab clicked: ${tabName}`);
    toast.info(`Funcionalidade ${tabName} será implementada em breve`);
  };

  return (
    <div className="bg-white border-b">
      <div className="flex p-2 overflow-x-auto">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => handleTabClick("Agenda")}
        >
          <Calendar className="h-4 w-4" />
          <span>Agenda</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => handleTabClick("Clientes")}
        >
          <Users className="h-4 w-4" />
          <span>Clientes</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => handleTabClick("Mapa")}
        >
          <Map className="h-4 w-4" />
          <span>Mapa</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => handleTabClick("Analytics")}
        >
          <Star className="h-4 w-4" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  );
};

export default TimelineTabs;
