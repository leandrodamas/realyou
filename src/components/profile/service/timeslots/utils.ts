
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

/**
 * Converts time string to minutes since midnight
 * @param timeString Time in format "HH:MM" or "HH:MM:SS"
 * @returns Minutes since midnight
 */
export const timeStringToMinutes = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  return parts[0] * 60 + parts[1];
};

/**
 * Generates hourly time slots between start and end times
 * @param startTime Start time string "HH:MM:SS"
 * @param endTime End time string "HH:MM:SS" 
 * @returns Array of hourly time slots in "HH:MM" format
 */
export const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);
  const slots: string[] = [];
  
  for (let mins = startMinutes; mins < endMinutes; mins += 60) {
    const hours = Math.floor(mins / 60);
    const formattedHours = hours.toString().padStart(2, '0');
    slots.push(`${formattedHours}:00`);
  }
  
  return slots;
};

/**
 * Fetches available time slots for a provider and date
 * @param providerId Provider's user ID
 * @param selectedDate Selected date
 * @param defaultSlots Default time slots to use if no data is found
 * @returns Promise resolving to available time slots
 */
export const fetchAvailableTimeSlots = async (
  providerId: string,
  selectedDate: Date,
  defaultSlots: string[]
): Promise<string[]> => {
  try {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayOfWeek = selectedDate.getDay();
    
    // Get provider's availability for this day of week
    const { data: schedulesData, error: schedulesError } = await supabase
      .from('service_schedules')
      .select('*')
      .eq('user_id', providerId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true);
    
    if (schedulesError) throw schedulesError;
    
    // Get existing bookings for this date
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('service_bookings')
      .select('*')
      .eq('provider_id', providerId)
      .eq('booking_date', dateStr)
      .in('status', ['confirmed', 'pending']);
    
    if (bookingsError) throw bookingsError;
    
    // Generate available slots based on provider's schedule
    if (!schedulesData || schedulesData.length === 0) {
      return defaultSlots;
    }
    
    // Generate slots from provider's schedule
    const allSlots: string[] = [];
    
    schedulesData.forEach(schedule => {
      const generatedSlots = generateTimeSlots(schedule.start_time, schedule.end_time);
      allSlots.push(...generatedSlots);
    });
    
    // Remove already booked times
    const bookedTimes = (bookingsData || []).map(booking => 
      booking.start_time.substring(0, 5)
    );
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    return availableSlots.length > 0 ? availableSlots : defaultSlots;
    
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return defaultSlots;
  }
};
