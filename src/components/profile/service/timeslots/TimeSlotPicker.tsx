
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTimeSlots } from "./useTimeSlots";
import TimeSlotHeader from "./TimeSlotHeader";
import TimeSlotGrid from "./TimeSlotGrid";
import TimeSlotActions from "./TimeSlotActions";
import TimeSlotEmptyState from "./TimeSlotEmptyState";
import TimeSlotLoading from "./TimeSlotLoading";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
  providerId?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
  providerId
}) => {
  const {
    slots,
    viewingUsers,
    realTimeViewers,
    isLoading,
    hasViewers,
    maxViewers
  } = useTimeSlots({
    selectedDate,
    providerId,
    availableTimeSlots
  });

  return (
    <Card>
      <TimeSlotHeader realTimeViewers={realTimeViewers} />
      <CardContent>
        {isLoading ? (
          <TimeSlotLoading />
        ) : selectedDate && slots.length > 0 ? (
          <div>
            <TimeSlotGrid
              slots={slots}
              viewingUsers={viewingUsers}
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
            />
            
            <TimeSlotActions
              selectedTime={selectedTime}
              onSchedule={onSchedule}
              hasViewers={hasViewers}
              maxViewers={maxViewers}
            />
          </div>
        ) : (
          <TimeSlotEmptyState
            selectedDate={selectedDate}
            hasSlots={slots.length > 0}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;
