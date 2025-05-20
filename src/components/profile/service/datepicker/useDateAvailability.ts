
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getDefaultDates } from "./dateUtils";

interface UseDateAvailabilityProps {
  providerId?: string;
  userId?: string;
}

export const useDateAvailability = ({ providerId, userId }: UseDateAvailabilityProps) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [urgentDates, setUrgentDates] = useState<Date[]>([]);
  const [highDemandDates, setHighDemandDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  
  // Initialize viewer count simulation
  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 4) + 1);
    
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 4) + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch actual availability data from Supabase
  useEffect(() => {
    if (!providerId && !userId) return;
    
    const targetId = providerId || userId;
    
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        // Get current date and two weeks ahead
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextTwoWeeks = new Date(today);
        nextTwoWeeks.setDate(today.getDate() + 14);
        
        // Fetch actual availability data from service_schedules table
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('service_schedules')
          .select('*')
          .eq('user_id', targetId)
          .eq('is_available', true);
        
        if (schedulesError) throw schedulesError;
        
        // Fetch existing bookings to avoid showing already booked slots
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('*')
          .eq('provider_id', targetId)
          .in('status', ['confirmed', 'pending'])
          .gte('booking_date', format(today, 'yyyy-MM-dd'))
          .lte('booking_date', format(nextTwoWeeks, 'yyyy-MM-dd'));
        
        if (bookingsError) throw bookingsError;
        
        // Process data to determine available dates
        const availableDays = new Set(schedulesData?.map(s => s.day_of_week) || []);
        const dates: Date[] = [];
        const urgents: Date[] = [];
        const highDemand: Date[] = [];
        
        // Check next 14 days for availability
        for (let i = 0; i <= 14; i++) {
          const date = addDays(today, i);
          const dayOfWeek = date.getDay(); // 0-6 (Sunday-Saturday)
          
          if (availableDays.has(dayOfWeek)) {
            // Check if not fully booked
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayBookings = (bookingsData || []).filter(b => b.booking_date === dateStr);
            
            // Assuming max 8 bookings per day
            if (dayBookings.length < 8) {
              dates.push(date);
              
              // Mark as urgent if within next 2 days
              if (i <= 2) {
                urgents.push(date);
              }
              
              // Mark as high demand if more than 5 bookings
              if (dayBookings.length >= 5) {
                highDemand.push(date);
              }
            }
          }
        }
        
        setAvailableDates(dates.length > 0 ? dates : getDefaultDates(today));
        setUrgentDates(urgents);
        setHighDemandDates(highDemand);
      } catch (error) {
        console.error('Error fetching availability data:', error);
        toast.error('Não foi possível carregar dados de disponibilidade');
        
        // Set default dates if error occurs
        setDefaultDates();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [providerId, userId]);
  
  // Set default dates for fallback
  const setDefaultDates = () => {
    const today = new Date();
    const dates = getDefaultDates(today);
    const urgents: Date[] = [];
    const highDemand: Date[] = [];
    
    dates.forEach((date, index) => {
      if (index < 2) urgents.push(date);
      if ([2, 5, 8].includes(index)) highDemand.push(date);
    });
    
    setAvailableDates(dates);
    setUrgentDates(urgents);
    setHighDemandDates(highDemand);
  };
  
  return {
    availableDates,
    urgentDates,
    highDemandDates,
    isLoading,
    viewerCount,
    isDateAvailable: (date: Date) => isDateInArray(date, availableDates),
    isUrgentDate: (date: Date) => isDateInArray(date, urgentDates),
    isHighDemandDate: (date: Date) => isDateInArray(date, highDemandDates)
  };
};

/**
 * Helper function used internally
 */
const isDateInArray = (date: Date, dateArray: Date[]) => {
  return dateArray.some(availableDate => 
    isSameDay(availableDate, date)
  );
};
