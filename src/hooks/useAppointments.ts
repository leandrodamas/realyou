
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AppointmentType, RealAppointment } from "@/components/calendar/types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { addDays, format, isSameDay } from "date-fns";

export const useAppointments = (weekDates: Date[] = []) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  // Retry mechanism
  const retryFetch = useCallback(() => {
    if (retryCount < 3) {
      console.log(`Retry attempt ${retryCount + 1}/3...`);
      setRetryCount(prev => prev + 1);
      setError(null);
    } else {
      console.error('Max retry attempts reached');
    }
  }, [retryCount]);

  // Memoize the fetch function to prevent unnecessary rerenders
  const fetchAppointments = useCallback(async () => {
    if (!user || weekDates.length === 0) {
      setAppointments([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the week dates for query
      const startDate = format(weekDates[0], 'yyyy-MM-dd');
      const endDate = format(weekDates[weekDates.length - 1], 'yyyy-MM-dd');
      
      console.log(`Fetching appointments from ${startDate} to ${endDate} for user ${user.id}`);
      
      // First fetch the bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('provider_id', user.id)
        .gte('booking_date', startDate)
        .lte('booking_date', endDate)
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        setError("Erro ao buscar agendamentos");
        throw bookingsError;
      }

      // Fetch service pricing in a separate query
      let serviceTitles: Record<string, string> = {};
      if (bookingsData && bookingsData.length > 0) {
        const serviceIds = bookingsData
          .map(booking => booking.service_id)
          .filter((id, index, self) => 
            id && id !== '00000000-0000-0000-0000-000000000000' && self.indexOf(id) === index
          );
        
        if (serviceIds.length > 0) {
          try {
            const { data: serviceData, error: serviceError } = await supabase
              .from('service_pricing')
              .select('id, title');
              
            if (serviceError) {
              console.error("Error fetching service pricing:", serviceError);
            } else if (serviceData) {
              serviceTitles = serviceData.reduce((acc, service) => {
                acc[service.id] = service.title;
                return acc;
              }, {} as Record<string, string>);
            }
          } catch (err) {
            console.error("Error in service pricing fetch:", err);
          }
        }
      }

      // Create a map to store client profile data
      const clientProfiles: Record<string, any> = {};
      
      // If we have bookings, fetch the client profiles in a separate query
      if (bookingsData && bookingsData.length > 0) {
        const clientIds = bookingsData
          .map(booking => booking.client_id)
          .filter(Boolean);
        
        if (clientIds.length > 0) {
          try {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .in('id', clientIds);
              
            if (profilesError) {
              console.error('Error fetching client profiles:', profilesError);
            } else if (profilesData) {
              // Create a map of client_id -> profile data for quick lookup
              profilesData.forEach(profile => {
                clientProfiles[profile.id] = profile;
              });
            }
          } catch (err) {
            console.error("Error in profiles fetch:", err);
          }
        }
      }

      // Convert to the expected format for the component
      const formattedAppointments = (bookingsData || []).map((booking: any): AppointmentType => {
        // Get the client profile from our map, or use default values if not found
        const clientProfile = clientProfiles[booking.client_id] || {};
        const serviceTitle = serviceTitles[booking.service_id] || 'Atendimento';
        
        // Extract only the hour from database format
        const startTime = booking.start_time.substring(0, 5);
        
        return {
          id: booking.id,
          date: new Date(booking.booking_date),
          time: startTime,
          title: serviceTitle,
          type: 'scheduled',
          status: booking.status,
          client: {
            name: clientProfile.full_name || 'Cliente',
            avatar: clientProfile.avatar_url || null,
            email: null
          },
          location: null,
          notes: null,
          price: booking.price_paid
        };
      });

      // Add free time slots for each day
      const allAppointments: AppointmentType[] = [];
      
      // Keep track of existing appointments by day and time
      const bookedSlots: Record<string, Set<string>> = {};
      
      // Add all scheduled appointments to allAppointments array
      // and track them in bookedSlots
      formattedAppointments.forEach(app => {
        allAppointments.push(app);
        
        const dateStr = format(app.date, 'yyyy-MM-dd');
        if (!bookedSlots[dateStr]) {
          bookedSlots[dateStr] = new Set();
        }
        bookedSlots[dateStr].add(app.time);
      });
      
      // Default available times
      const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      
      // Add free time slots for each day in weekDates
      weekDates.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayBookedSlots = bookedSlots[dateStr] || new Set();
        
        // Filter out times that are already booked
        const freeTimes = availableTimes.filter(time => !dayBookedSlots.has(time));
        
        // Add free time slots
        freeTimes.forEach(time => {
          allAppointments.push({
            id: `free-${dateStr}-${time}`,
            date: new Date(dateStr),
            time,
            title: 'Horário Disponível',
            type: 'free',
            status: 'available',
            client: null,
            location: null,
            notes: null
          });
        });
      });
      
      // Sort appointments by date and time
      allAppointments.sort((a, b) => {
        // First compare by date
        const dateComparison = a.date.getTime() - b.date.getTime();
        if (dateComparison !== 0) return dateComparison;
        
        // If same date, compare by time
        return a.time.localeCompare(b.time);
      });
      
      setAppointments(allAppointments);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setError("Não foi possível carregar seus agendamentos");
      setAppointments([]); // Clear appointments on error
      
      // Don't show toast on first load error to prevent spamming
      if (retryCount > 0) {
        toast.error('Não foi possível carregar seus agendamentos', {
          description: 'Tente novamente mais tarde'
        });
      }
      
      // Auto retry mechanism
      if (retryCount < 3) {
        setTimeout(() => {
          retryFetch();
        }, 3000); // Wait 3 seconds before retry
      }
    } finally {
      setIsLoading(false);
    }
  }, [weekDates, user, retryCount, retryFetch]);

  useEffect(() => {
    fetchAppointments();
    
    // Setup refresh interval - update data every 2 minutes
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 120000); // 2 minutes
    
    return () => clearInterval(intervalId);
  }, [fetchAppointments]);

  // Add a manual refresh function
  const refreshAppointments = () => {
    setRetryCount(0); // Reset retry count
    fetchAppointments();
    toast.info("Atualizando agendamentos...");
  };

  return { 
    appointments, 
    isLoading,
    error,
    refreshAppointments
  };
};
