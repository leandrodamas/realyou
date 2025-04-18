import React from "react";
import { Button } from "@/components/ui/button";
import { ScheduleSlot } from "../types/MatchedPersonTypes";

interface ScheduleListProps {
  schedule: ScheduleSlot[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedule }) => {
  const activeSchedule = schedule.filter(day => day.active);

  if (activeSchedule.length === 0) {
    return (
      <p className="text-xs text-gray-500">
        Nenhum horário disponível
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activeSchedule.map((day, index) => (
        <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
          <p className="text-sm font-medium">{day.day}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {day.slots.map((slot, slotIndex) => (
              <Button
                key={slotIndex}
                variant="secondary"
                className="text-xs h-7 px-2"
                size="sm"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
