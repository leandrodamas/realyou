
import React from "react";
import { TrendingUp } from "lucide-react";

interface CalendarDayProps {
  date: Date;
  isUrgent: boolean;
  isHighDemand: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  date,
  isUrgent,
  isHighDemand
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div>{date.getDate()}</div>
      {isUrgent && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="h-1 w-5 bg-amber-500 rounded-full"></div>
        </div>
      )}
      {isHighDemand && (
        <div className="absolute top-0 right-0">
          <TrendingUp className="h-3 w-3 text-rose-500" />
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
