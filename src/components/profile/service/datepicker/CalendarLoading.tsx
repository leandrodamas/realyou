
import React from "react";

const CalendarLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-64 w-full bg-gray-100 animate-pulse rounded-md"></div>
      <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded-md"></div>
    </div>
  );
};

export default CalendarLoading;
