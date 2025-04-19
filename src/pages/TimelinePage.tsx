
import React, { useState } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineTabs from "@/components/timeline/TimelineTabs";
import TimelineStats from "@/components/timeline/TimelineStats";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import VisualTimeline from "@/components/calendar/VisualTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign, MapPin } from "lucide-react";

const TimelinePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointmentFilters, setAppointmentFilters] = useState<string[]>(["scheduled", "free", "buffer", "blocked"]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFiltersChange = (filters: string[]) => {
    setAppointmentFilters(filters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TimelineHeader />
      <TimelineTabs />
      <TimelineStats />
      
      <div className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Seu Perfil Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">Dr. Carlos Silva</h3>
                <p className="text-gray-600">Desenvolvedor Senior</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    4.9
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <DollarSign className="h-3 w-3 mr-1" />
                    R$180/hora
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    São Paulo
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TimelineFilters 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange}
          appointmentFilters={appointmentFilters}
          onFiltersChange={handleFiltersChange}
        />
        
        <div className="mt-4">
          <VisualTimeline 
            initialDate={selectedDate}
            filters={appointmentFilters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
