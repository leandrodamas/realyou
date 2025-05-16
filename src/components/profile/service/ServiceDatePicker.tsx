
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Check, Zap, TrendingUp, Users } from "lucide-react";
import { format, isSameDay, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ServiceDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  providerId?: string;
}

const ServiceDatePicker: React.FC<ServiceDatePickerProps> = ({
  selectedDate,
  onDateSelect,
  providerId
}) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [urgentDates, setUrgentDates] = useState<Date[]>([]);
  const [highDemandDates, setHighDemandDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch actual availability data from Supabase
  useEffect(() => {
    if (!providerId && !user?.id) return;
    
    const targetId = providerId || user?.id;
    
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
  }, [providerId, user?.id]);
  
  // Default dates generator function
  const getDefaultDates = (startDate: Date) => {
    const dates: Date[] = [];
    for (let i = 1; i <= 14; i++) {
      if (i % 3 !== 0) { // Skip every third day
        dates.push(addDays(startDate, i));
      }
    }
    return dates;
  };
  
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
  
  // Helper functions for calendar display
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      isSameDay(availableDate, date)
    );
  };
  
  const isUrgentDate = (date: Date) => {
    return urgentDates.some(urgentDate => 
      isSameDay(urgentDate, date)
    );
  };
  
  const isHighDemandDate = (date: Date) => {
    return highDemandDates.some(highDemandDate => 
      isSameDay(highDemandDate, date)
    );
  };
  
  // Simulate viewer count
  const [viewerCount, setViewerCount] = useState(0);
  
  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 4) + 1);
    
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 4) + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
            Selecione uma data
          </CardTitle>
          {viewerCount > 0 && (
            <Badge variant="outline" className="bg-purple-50 border-purple-100 text-purple-700">
              <Users className="h-3 w-3 mr-1" />
              {viewerCount} online
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-64 w-full bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-6 w-3/4 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              className="rounded-md border pointer-events-auto"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !isDateAvailable(date);
              }}
              modifiers={{
                urgent: (date) => isUrgentDate(date),
                highDemand: (date) => isHighDemandDate(date)
              }}
              modifiersClassNames={{
                urgent: "bg-amber-50 text-amber-900 font-medium",
                highDemand: "bg-rose-50 text-rose-900 font-medium"
              }}
              components={{
                DayContent: (props) => {
                  const isUrgent = isUrgentDate(props.date);
                  const isHighDemand = isHighDemandDate(props.date);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div>{props.date.getDate()}</div>
                      {isUrgent && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="h-1 w-5 bg-amber-500 rounded-full"></div>
                        </div>
                      )}
                      {isHighDemand && (
                        <div className="absolute top-0 right-0">
                          <TrendingUp className="h-3 w-3 text-rose-500" />
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
            
            <div className="flex flex-wrap gap-1 mt-4 text-xs">
              <Badge variant="outline" className="bg-white">
                <div className="h-2 w-2 bg-purple-600 rounded-full mr-1"></div>
                Disponível
              </Badge>
              <Badge variant="outline" className="bg-amber-50 border-amber-200">
                <div className="h-2 w-2 bg-amber-500 rounded-full mr-1"></div>
                Disponibilidade urgente
              </Badge>
              <Badge variant="outline" className="bg-rose-50 border-rose-200">
                <TrendingUp className="h-3 w-3 text-rose-500 mr-1" />
                Preço dinâmico (+20%)
              </Badge>
            </div>
            
            {selectedDate && (
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-xs text-purple-700 font-medium">
                  {isUrgentDate(selectedDate) ? (
                    <span className="flex items-center justify-center">
                      <Check className="h-3 w-3 mr-1" />
                      Disponibilidade confirmada para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  ) : isHighDemandDate(selectedDate) ? (
                    <span className="flex items-center justify-center text-rose-600">
                      <Zap className="h-3 w-3 mr-1" />
                      Alta demanda em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} (preço dinâmico)
                    </span>
                  ) : (
                    <span>
                      Data selecionada: {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceDatePicker;
