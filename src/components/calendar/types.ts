export interface VisualTimelineProps {
  initialDate?: Date;
  showBookingActions?: boolean;
  filters?: string[];
  onFiltersChange?: (filters: string[]) => void;
}

export interface WeekDaySelectorProps {
  weekDates: Date[];
  currentDate: Date;
  onDaySelect: (date: Date) => void;
  appointments: AppointmentType[];
}

export interface DayHeaderProps {
  selectedDate: Date;
}

export interface AppointmentType {
  id: string;
  date: Date;
  time: string;
  title: string;
  type: 'scheduled' | 'free' | 'buffer' | 'blocked';
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'available';
  client: Client | null;
  location: string | null;
  notes: string | null;
  price?: number | null;
}

export interface Client {
  name: string;
  avatar: string | null;
  email: string | null;
}

export interface AppointmentItemProps {
  appointment: AppointmentType;
  isSelected: boolean;
  showBookingActions: boolean;
  onTimeSelect: (time: string) => void;
}

// Adicionando tipos de agendamento real
export interface RealAppointment {
  id: string;
  provider_id: string;
  service_id: string;
  client_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price_paid: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_avatar?: string;
  service_title?: string;
}
