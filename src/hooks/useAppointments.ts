
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
        // Formatar as datas da semana para consulta
        const startDate = format(weekDates[0], 'yyyy-MM-dd');
        const endDate = format(weekDates[weekDates.length - 1], 'yyyy-MM-dd');
        
        const { data: bookingsData, error } = await supabase
          .from('service_bookings')
          .select(`
            *,
            profiles!client_id(full_name, avatar_url),
            service_pricing(title)
          `)
          .eq('provider_id', user.id)
          .gte('booking_date', startDate)
          .lte('booking_date', endDate)
          .order('booking_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error) throw error;

        // Converter para o formato esperado pelo componente
        const formattedAppointments = (bookingsData || []).map((booking: any): AppointmentType => {
          const clientProfile = booking.profiles || {};
          const serviceInfo = booking.service_pricing || {};
          
          // Extrair apenas a hora do formato do banco de dados
          const startTime = booking.start_time.substring(0, 5);
          
          return {
            id: booking.id,
            date: new Date(booking.booking_date),
            time: startTime,
            title: serviceInfo.title || 'Atendimento',
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

        // Adicionar horários livres para cada dia
        const allAppointments = [...formattedAppointments];
        
        // Preencher horários livres nos dias que não têm todos os horários ocupados
        weekDates.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayAppointments = formattedAppointments.filter(
            app => format(app.date, 'yyyy-MM-dd') === dateStr
          );
          
          // Horários disponíveis padrão
          const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
          
          // Remover horários já agendados
          const busyTimes = dayAppointments.map(app => app.time);
          const freeTimes = availableTimes.filter(time => !busyTimes.includes(time));
          
          // Adicionar horários livres
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
