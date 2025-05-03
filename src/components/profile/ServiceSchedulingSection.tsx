
import React, { useState } from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/drawer";
import IntegratedScheduleView from "./schedule/IntegratedScheduleView";
import ScheduleSuccessDrawer from "./schedule/ScheduleSuccessDrawer";
import PublicToggle from "./service/PublicToggle";
import MarketingPrompt from "./service/MarketingPrompt";
import ServiceInformation from "./service/ServiceInformation";

interface ServiceSchedulingSectionProps {
  isOwner?: boolean;
}

const ServiceSchedulingSection: React.FC<ServiceSchedulingSectionProps> = ({ isOwner = true }) => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);

  const availableTimeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

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
        profileImage="https://randomuser.me/api/portraits/men/32.jpg"
        name="Dr. Carlos Silva"
        basePrice={180}
      />

      <ServiceInformation />

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
