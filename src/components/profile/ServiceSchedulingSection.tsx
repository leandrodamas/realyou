
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/drawer";
import IntegratedScheduleView from "./schedule/IntegratedScheduleView";
import ScheduleSuccessDrawer from "./schedule/ScheduleSuccessDrawer";
import PublicToggle from "./service/PublicToggle";
import MarketingPrompt from "./service/MarketingPrompt";
import ServiceInformation from "./service/ServiceInformation";
import { useProfileStorage, DEFAULT_PROFILE } from "@/hooks/facial-recognition/useProfileStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ServiceSchedulingSectionProps {
  isOwner?: boolean;
  providerId?: string;
}

const ServiceSchedulingSection: React.FC<ServiceSchedulingSectionProps> = ({ 
  isOwner = true,
  providerId
}) => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ]);
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
        const { data: pricingData, error } = await supabase
          .from('service_pricing')
          .select('base_price, dynamic_pricing, peak_price_multiplier, id')
          .eq('user_id', targetId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (providerId && providerId !== user?.id) {
          setProfileData({
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            name: "Dr. Carlos Silva",
            basePrice: pricingData?.base_price || 180
          });
        } else {
          setProfileData({
            profileImage: profile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
            name: profile.fullName || "Dr. Carlos Silva",
            basePrice: pricingData?.base_price || profile.basePrice || 180
          });
        }
        
        const { data: schedulesData } = await supabase
          .from('service_schedules')
          .select('start_time')
          .eq('user_id', targetId)
          .eq('is_available', true);
        
        if (schedulesData && schedulesData.length > 0) {
          const timeSlots = [...new Set(schedulesData.map(s => 
            s.start_time.substring(0, 5)
          ))];
          
          if (timeSlots.length > 0) {
            setAvailableTimeSlots(timeSlots);
          }
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados do serviço:", error);
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
      
      const { data: existingBooking } = await supabase
        .from('service_bookings')
        .select('id')
        .eq('provider_id', providerId || user.id)
        .eq('booking_date', serviceDate)
        .eq('start_time', `${selectedTime}:00`)
        .single();
      
      if (existingBooking) {
        toast.error("Este horário já está reservado. Por favor, escolha outro horário.");
        return;
      }
      
      const [startHour, startMinute] = selectedTime.split(':').map(Number);
      let endHour = startHour + 1;
      const endMinute = startMinute;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;
      
      const { data: pricingData } = await supabase
        .from('service_pricing')
        .select('base_price, dynamic_pricing, peak_price_multiplier, id')
        .eq('user_id', providerId || user.id)
        .single();
      
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

  return (
    <div className="space-y-6">
      {isOwner && (
        <PublicToggle 
          showPublicly={showPublicly} 
          onChange={setShowPublicly} 
        />
      )}
      
      {isOwner && isPromptVisible && (
        <MarketingPrompt 
          isPromptVisible={isPromptVisible} 
          onDismiss={() => setIsPromptVisible(false)} 
        />
      )}

      <IntegratedScheduleView
        selectedDate={date}
        onDateSelect={setDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        onSchedule={handleScheduleService}
        availableTimeSlots={availableTimeSlots}
        profileImage={profileData.profileImage}
        name={profileData.name}
        basePrice={profileData.basePrice}
        providerId={providerId}
      />

      <ServiceInformation isOwner={isOwner} />

      <Drawer open={showMatchSuccess} onOpenChange={setShowMatchSuccess}>
        <ScheduleSuccessDrawer 
          date={date}
          selectedTime={selectedTime}
        />
      </Drawer>
    </div>
  );
};

export default ServiceSchedulingSection;
