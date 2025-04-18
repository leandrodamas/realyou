
import React, { useState } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineTabs from "@/components/timeline/TimelineTabs";
import TimelineStats from "@/components/timeline/TimelineStats";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import VisualTimeline from "@/components/calendar/VisualTimeline";

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
      <TimelineFilters 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange}
        appointmentFilters={appointmentFilters}
        onFiltersChange={handleFiltersChange}
      />
      
      {/* Timeline component */}
      <div className="p-4">
        <VisualTimeline 
          initialDate={selectedDate}
          filters={appointmentFilters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  );
};

export default TimelinePage;
