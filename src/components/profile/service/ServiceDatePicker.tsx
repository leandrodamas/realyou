
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

import { useDateAvailability } from "./datepicker/useDateAvailability";
import CalendarDay from "./datepicker/CalendarDay";
import DateSelected from "./datepicker/DateSelected";
import CalendarLegend from "./datepicker/CalendarLegend";
import CalendarLoading from "./datepicker/CalendarLoading";

interface ServiceDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  providerId?: string;
}

const ServiceDatePicker: React.FC<ServiceDatePickerProps> = ({
  selectedDate,
  onDateSelect,
  providerId
}) => {
  const { user } = useAuth();
  
  const {
    availableDates,
    urgentDates,
    highDemandDates,
    isLoading,
    viewerCount,
    isDateAvailable,
    isUrgentDate,
    isHighDemandDate
  } = useDateAvailability({ 
    providerId, 
    userId: user?.id 
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
            Selecione uma data
          </CardTitle>
          {viewerCount > 0 && (
            <Badge variant="outline" className="bg-purple-50 border-purple-100 text-purple-700">
              <Users className="h-3 w-3 mr-1" />
              {viewerCount} online
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CalendarLoading />
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              className="rounded-md border pointer-events-auto"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !isDateAvailable(date);
              }}
              modifiers={{
                urgent: (date) => isUrgentDate(date),
                highDemand: (date) => isHighDemandDate(date)
              }}
              modifiersClassNames={{
                urgent: "bg-amber-50 text-amber-900 font-medium",
                highDemand: "bg-rose-50 text-rose-900 font-medium"
              }}
              components={{
                DayContent: (props) => (
                  <CalendarDay 
                    date={props.date}
                    isUrgent={isUrgentDate(props.date)}
                    isHighDemand={isHighDemandDate(props.date)}
                  />
                )
              }}
            />
            
            <CalendarLegend />
            
            {selectedDate && (
              <DateSelected 
                selectedDate={selectedDate} 
                isUrgentDate={isUrgentDate}
                isHighDemandDate={isHighDemandDate}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceDatePicker;
