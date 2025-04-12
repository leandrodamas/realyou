
export interface AppointmentType {
  id: string;
  title: string;
  time: string;
  duration: number; // in minutes
  clientName?: string;
  clientImage?: string;
  type: "scheduled" | "free" | "buffer" | "blocked";
  status?: "confirmed" | "pending" | "completed";
  location?: "online" | "in-person";
  price?: number;
  notes?: string; // Optional notes for the appointment
}

export interface TimelineDay {
  date: Date;
  appointments: AppointmentType[];
}

export interface VisualTimelineProps {
  initialDate?: Date;
  showBookingActions?: boolean;
  filters?: string[];
  onFiltersChange?: (filters: string[]) => void;
}
