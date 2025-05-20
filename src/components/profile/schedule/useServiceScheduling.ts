
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfileStorage, DEFAULT_PROFILE } from "@/hooks/facial-recognition/useProfileStorage";
import { useAuth } from "@/hooks/useAuth";

interface UseServiceSchedulingProps {
  providerId?: string;
}

export const useServiceScheduling = ({ providerId }: UseServiceSchedulingProps) => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getProfile } = useProfileStorage();
  const { user } = useAuth();
  const profile = getProfile() || DEFAULT_PROFILE;
  
  const [profileData, setProfileData] = useState({
    profileImage: profile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
    name: profile.fullName || "Dr. Carlos Silva",
    basePrice: profile.basePrice || 180
  });

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!providerId && !user?.id) return;
      
      const targetId = providerId || user?.id;
      setIsLoading(true);
      
      try {
        // Get service pricing data
        const { data: pricingData, error: pricingError } = await supabase
          .from('service_pricing')
          .select('base_price, dynamic_pricing, peak_price_multiplier, id, title')
          .eq('user_id', targetId)
          .maybeSingle();
        
        if (pricingError && pricingError.code !== 'PGRST116') {
          throw pricingError;
        }
        
        // Get user profile data
        const { data: profileDbData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, profession')
          .eq('id', targetId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        // Get available schedule time slots
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('service_schedules')
          .select('start_time, end_time, day_of_week')
          .eq('user_id', targetId)
          .eq('is_available', true);
          
        if (schedulesError) {
          console.error("Error fetching schedules:", schedulesError);
        }
        
        // Set profile data based on DB data
        if (profileDbData) {
          setProfileData({
            profileImage: profileDbData.avatar_url || profile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
            name: profileDbData.full_name || profile.fullName || "Dr. Carlos Silva",
            basePrice: pricingData?.base_price || profile.basePrice || 180
          });
        }
        
        // Generate available time slots from schedules
        if (schedulesData && schedulesData.length > 0) {
          const timeSlots = new Set<string>();
          schedulesData.forEach(schedule => {
            const startParts = schedule.start_time.split(':').map(Number);
            const endParts = schedule.end_time.split(':').map(Number);
            
            const startMinutes = startParts[0] * 60 + startParts[1];
            const endMinutes = endParts[0] * 60 + endParts[1];
            
            // Generate hourly slots
            for (let mins = startMinutes; mins < endMinutes; mins += 60) {
              const hours = Math.floor(mins / 60);
              const formattedHours = hours.toString().padStart(2, '0');
              timeSlots.add(`${formattedHours}:00`);
            }
          });
          
          if (timeSlots.size > 0) {
            setAvailableTimeSlots(Array.from(timeSlots));
          } else {
            // Fallback to default slots
            setAvailableTimeSlots([
              "08:00", "09:00", "10:00", "11:00", 
              "14:00", "15:00", "16:00", "17:00"
            ]);
          }
        } else {
          // No schedules found, use default slots
          setAvailableTimeSlots([
            "08:00", "09:00", "10:00", "11:00", 
            "14:00", "15:00", "16:00", "17:00"
          ]);
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados do serviço:", error);
        // Use default values
        setAvailableTimeSlots([
          "08:00", "09:00", "10:00", "11:00", 
          "14:00", "15:00", "16:00", "17:00"
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProviderData();
    
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedProfile = customEvent.detail?.profile || getProfile() || {};
      
      setProfileData({
        profileImage: updatedProfile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
        name: updatedProfile.fullName || "Dr. Carlos Silva",
        basePrice: updatedProfile.basePrice || 180
      });
      
      if (updatedProfile.availableTimeSlots) {
        setAvailableTimeSlots(updatedProfile.availableTimeSlots);
      }
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [providerId, user?.id, getProfile, profile]);

  const handleScheduleService = async () => {
    if (!date || !selectedTime) {
      toast.error("Por favor, selecione data e horário para agendar");
      return;
    }
    
    if (!user) {
      toast.error("Você precisa estar logado para agendar um serviço");
      return;
    }
    
    try {
      const serviceDate = date.toISOString().split('T')[0];
      
      // Check if booking already exists
      const { data: existingBooking } = await supabase
        .from('service_bookings')
        .select('id')
        .eq('provider_id', providerId || user.id)
        .eq('booking_date', serviceDate)
        .eq('start_time', `${selectedTime}:00`)
        .maybeSingle();
      
      if (existingBooking) {
        toast.error("Este horário já está reservado. Por favor, escolha outro horário.");
        return;
      }
      
      // Calculate end time (1 hour after start time)
      const [startHour, startMinute] = selectedTime.split(':').map(Number);
      let endHour = startHour + 1;
      const endMinute = startMinute;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;
      
      // Get service pricing
      const { data: pricingData } = await supabase
        .from('service_pricing')
        .select('base_price, dynamic_pricing, peak_price_multiplier, id')
        .eq('user_id', providerId || user.id)
        .maybeSingle();
      
      let price = profileData.basePrice;
      let serviceId = null;
      
      if (pricingData) {
        price = pricingData.base_price;
        serviceId = pricingData.id;
        
        if (pricingData.dynamic_pricing && 
            (date.getDay() === 1 || date.getDay() === 5)) {
          price = Math.round(price * (pricingData.peak_price_multiplier || 1.2));
        }
      }
      
      // Create booking
      const { error } = await supabase
        .from('service_bookings')
        .insert({
          provider_id: providerId || user.id,
          client_id: user.id,
          service_id: serviceId || '00000000-0000-0000-0000-000000000000',
          booking_date: serviceDate,
          start_time: `${selectedTime}:00`,
          end_time: endTime,
          price_paid: price,
          status: 'pending'
        });
      
      if (error) throw error;
      
      setShowMatchSuccess(true);
      
    } catch (error) {
      console.error("Erro ao agendar serviço:", error);
      toast.error("Não foi possível realizar o agendamento. Tente novamente.");
    }
  };

  return {
    showPublicly,
    setShowPublicly,
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    isPromptVisible,
    setIsPromptVisible,
    showMatchSuccess,
    setShowMatchSuccess,
    availableTimeSlots,
    profileData,
    handleScheduleService
  };
};
