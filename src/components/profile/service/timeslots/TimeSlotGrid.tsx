
import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotGridProps {
  slots: string[];
  viewingUsers: {[key: string]: number};
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  viewingUsers,
  selectedTime,
  onTimeSelect
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((time) => {
        const viewers = viewingUsers[time] || 0;
        const isHighDemand = viewers >= 3;
        
        return (
          <div key={time} className="relative">
            <Button
              variant={selectedTime === time ? "default" : "outline"}
              className={cn(
                "h-10 w-full relative",
                selectedTime === time && "bg-purple-600 hover:bg-purple-700",
                isHighDemand && "border-amber-300"
              )}
              onClick={() => onTimeSelect(time)}
            >
              {time}
              {isHighDemand && (
                <div className="absolute -top-1 -right-1">
                  <div className="flex items-center bg-red-500 text-white text-[10px] rounded-full px-1 animate-pulse">
                    <Users className="h-2 w-2 mr-0.5" />
                    {viewers}
                  </div>
                </div>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
