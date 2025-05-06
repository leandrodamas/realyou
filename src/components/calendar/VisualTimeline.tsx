
import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { VisualTimelineProps } from "./types";
import TimelineNavigation from "./TimelineNavigation";
import WeekDaySelector from "./WeekDaySelector";
import DayHeader from "./DayHeader";
import AppointmentItem from "./AppointmentItem";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";

const VisualTimeline: React.FC<VisualTimelineProps> = ({ 
  initialDate = new Date(),
  showBookingActions = true,
  filters = ["scheduled", "free", "buffer", "blocked"],
  onFiltersChange
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<string[]>(filters);
  
  // Update currentDate when initialDate changes
  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  // Update filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Generate a week of dates starting from currentDate
  const weekDates = [...Array(7)].map((_, i) => addDays(currentDate, i));
  
  // Fetch real appointments data
  const { appointments, isLoading } = useAppointments(weekDates);
  
  const navigatePrevWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const navigateNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const handleDaySelect = (date: Date) => {
    setCurrentDate(date);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time === selectedTime ? null : time);
  };

  const handleFiltersChange = (newFilters: string[]) => {
    setLocalFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };
  
  // Get appointments for selected day and apply filters
  const dayAppointments = appointments
    .filter(appointment => 
      appointment.date.toDateString() === currentDate.toDateString() &&
      localFilters.includes(appointment.type)
    );

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Timeline header with navigation */}
      <TimelineNavigation 
        currentDate={currentDate}
        onPrevWeek={navigatePrevWeek}
        onNextWeek={navigateNextWeek}
      />
      
      {/* Week days selector */}
      <WeekDaySelector 
        weekDates={weekDates}
        currentDate={currentDate}
        onDaySelect={handleDaySelect}
        appointments={appointments}
      />
      
      {/* Appointments for the selected day */}
      <div className="p-4">
        <DayHeader selectedDate={currentDate} />
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : dayAppointments.length > 0 ? (
          <div className="space-y-3">
            {dayAppointments.map(appointment => (
              <AppointmentItem 
                key={appointment.id}
                appointment={appointment}
                isSelected={appointment.time === selectedTime}
                showBookingActions={showBookingActions}
                onTimeSelect={handleTimeSelect}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>Nenhum compromisso encontrado para esta data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualTimeline;
