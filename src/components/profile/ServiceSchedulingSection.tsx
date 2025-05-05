
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/drawer";
import IntegratedScheduleView from "./schedule/IntegratedScheduleView";
import ScheduleSuccessDrawer from "./schedule/ScheduleSuccessDrawer";
import PublicToggle from "./service/PublicToggle";
import MarketingPrompt from "./service/MarketingPrompt";
import ServiceInformation from "./service/ServiceInformation";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";

interface ServiceSchedulingSectionProps {
  isOwner?: boolean;
}

const ServiceSchedulingSection: React.FC<ServiceSchedulingSectionProps> = ({ isOwner = true }) => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ]);
  
  const { getProfile } = useProfileStorage();
  const profile = getProfile() || {};
  
  // Dados do profissional baseados no perfil
  const [profileData, setProfileData] = useState({
    profileImage: profile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
    name: profile.fullName || "Dr. Carlos Silva",
    basePrice: profile.basePrice || 180
  });
  
  // Atualizar os dados quando o perfil mudar
  useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedProfile = customEvent.detail?.profile || getProfile() || {};
      
      setProfileData({
        profileImage: updatedProfile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
        name: updatedProfile.fullName || "Dr. Carlos Silva",
        basePrice: updatedProfile.basePrice || 180
      });
      
      // Atualizar horários disponíveis baseados nas configurações do usuário
      if (updatedProfile.availableTimeSlots) {
        setAvailableTimeSlots(updatedProfile.availableTimeSlots);
      }
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Carregar dados iniciais
    const currentProfile = getProfile() || {};
    setProfileData({
      profileImage: currentProfile.profileImage || "https://randomuser.me/api/portraits/men/32.jpg",
      name: currentProfile.fullName || "Dr. Carlos Silva",
      basePrice: currentProfile.basePrice || 180
    });
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [getProfile]);

  const handleScheduleService = () => {
    if (!date || !selectedTime) {
      toast.error("Por favor, selecione data e horário para agendar");
      return;
    }
    setShowMatchSuccess(true);
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
