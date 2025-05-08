
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AppointmentType, RealAppointment } from "@/components/calendar/types";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { addDays, format } from "date-fns";

export const useAppointments = (weekDates: Date[] = []) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || weekDates.length === 0) return;
    
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Format the week dates for query
        const startDate = format(weekDates[0], 'yyyy-MM-dd');
        const endDate = format(weekDates[weekDates.length - 1], 'yyyy-MM-dd');
        
        // First fetch the bookings without trying to join profiles directly
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('*')
          .eq('provider_id', user.id)
          .gte('booking_date', startDate)
          .lte('booking_date', endDate)
          .order('booking_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (bookingsError) throw bookingsError;

        // Fetch service pricing separately to avoid 406 errors
        let serviceTitles: Record<string, string> = {};
        if (bookingsData && bookingsData.length > 0) {
          const serviceIds = bookingsData
            .map(booking => booking.service_id)
            .filter(id => id && id !== '00000000-0000-0000-0000-000000000000');
          
          if (serviceIds.length > 0) {
            const { data: serviceData, error: serviceError } = await supabase
              .from('service_pricing')
              .select('id, title')
              .in('id', serviceIds);
              
            if (!serviceError && serviceData) {
              serviceTitles = serviceData.reduce((acc, service) => {
                acc[service.id] = service.title;
                return acc;
              }, {} as Record<string, string>);
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
        const allAppointments = [...formattedAppointments];
        
        // Fill in free time slots on days that don't have all slots occupied
        weekDates.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayAppointments = formattedAppointments.filter(
            app => format(app.date, 'yyyy-MM-dd') === dateStr
          );
          
          // Default available times
          const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
          
          // Remove times that are already scheduled
          const busyTimes = dayAppointments.map(app => app.time);
          const freeTimes = availableTimes.filter(time => !busyTimes.includes(time));
          
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
        
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        toast.error('Não foi possível carregar seus agendamentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [weekDates, user]);

  return { appointments, isLoading };
};
