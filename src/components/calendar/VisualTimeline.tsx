
import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { VisualTimelineProps } from "./types";
import TimelineNavigation from "./TimelineNavigation";
import WeekDaySelector from "./WeekDaySelector";
import DayHeader from "./DayHeader";
import AppointmentItem from "./AppointmentItem";
import { generateMockAppointmentsData, getDayAppointments } from "./mockData";

const VisualTimeline: React.FC<VisualTimelineProps> = ({ 
  initialDate = new Date(),
  showBookingActions = true
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>(["scheduled", "free", "buffer", "blocked"]);
  
  // Update currentDate when initialDate changes
  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);
  
  // Generate a week of dates starting from currentDate
  const weekDates = [...Array(7)].map((_, i) => addDays(currentDate, i));
  
  // Generate mock data
  const mockAppointmentsData = generateMockAppointmentsData(weekDates);
  
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
    setFilters(newFilters);
  };
  
  // Apply filters to appointments
  const dayAppointments = getDayAppointments(currentDate, mockAppointmentsData)
    .filter(appointment => filters.includes(appointment.type));

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
        mockAppointmentsData={mockAppointmentsData}
      />
      
      {/* Appointments for the selected day */}
      <div className="p-4">
        <DayHeader selectedDate={currentDate} />
        
        {/* Time slots */}
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
      </div>
    </div>
  );
};

export default VisualTimeline;
