
import React from "react";
import { WeekDaySelectorProps } from "./types";
import { WeekDay } from "./types";

const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({ 
  selectedDays, 
  onToggleDay, 
  dayLabels 
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Dias da semana</h4>
      <div className="grid grid-cols-7 gap-1">
        {(Object.keys(dayLabels) as WeekDay[]).map((day) => (
          <div
            key={day}
            className={`text-center py-2 px-1 rounded-md cursor-pointer text-sm ${
              selectedDays.includes(day) 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => onToggleDay(day)}
          >
            {dayLabels[day].substring(0, 3)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekDaySelector;
