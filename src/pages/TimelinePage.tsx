
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Map, Star, Users, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VisualTimeline from "@/components/calendar/VisualTimeline";
import { Button } from "@/components/ui/button";

const TimelinePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-medium">Agenda Visual</h1>
          <p className="text-sm text-gray-500">
            Gerencie seus compromissos
          </p>
        </div>
      </header>
      
      {/* Calendar tabs */}
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
      
      {/* Calendar stats */}
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
      
      {/* Calendar view filters */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <span>Todos</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
          >
            Dia
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="text-xs bg-purple-600"
          >
            Semana
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
          >
            Mês
          </Button>
        </div>
      </div>
      
      {/* Timeline component */}
      <div className="p-4">
        <VisualTimeline />
      </div>
    </div>
  );
};

export default TimelinePage;
