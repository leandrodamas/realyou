
export interface AvailabilityFormProps {
  onComplete: () => void;
}

export interface WeekDaySelectorProps {
  selectedDays: WeekDay[];
  onToggleDay: (day: WeekDay) => void;
  dayLabels: Record<WeekDay, string>;
}

export interface TimeSlotSelectorProps {
  timeSlots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  onToggleTimeSlot: (slot: keyof typeof timeSlots) => void;
}

export interface CalendarSyncButtonProps {
  onSync: () => void;
}

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
