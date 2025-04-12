
import React, { useState } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineTabs from "@/components/timeline/TimelineTabs";
import TimelineStats from "@/components/timeline/TimelineStats";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import VisualTimeline from "@/components/calendar/VisualTimeline";

const TimelinePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TimelineHeader />
      <TimelineTabs />
      <TimelineStats />
      <TimelineFilters 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange} 
      />
      
      {/* Timeline component */}
      <div className="p-4">
        <VisualTimeline initialDate={selectedDate} />
      </div>
    </div>
  );
};

export default TimelinePage;
