
import React from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineTabs from "@/components/timeline/TimelineTabs";
import TimelineStats from "@/components/timeline/TimelineStats";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import VisualTimeline from "@/components/calendar/VisualTimeline";

const TimelinePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <TimelineHeader />
      <TimelineTabs />
      <TimelineStats />
      <TimelineFilters />
      
      {/* Timeline component */}
      <div className="p-4">
        <VisualTimeline />
      </div>
    </div>
  );
};

export default TimelinePage;
