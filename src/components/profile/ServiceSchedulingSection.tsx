
import React, { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import refactored components
import PublicToggle from "./service/PublicToggle";
import MarketingPrompt from "./service/MarketingPrompt";
import ServiceDatePicker from "./service/ServiceDatePicker";
import TimeSlotPicker from "./service/TimeSlotPicker";
import ServiceInformation from "./service/ServiceInformation";

const ServiceSchedulingSection: React.FC = () => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  
  // Available time slots for the selected date
  const availableTimeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];
  
  const handleScheduleService = () => {
    if (!date || !selectedTime) {
      toast.error("Por favor, selecione data e horário para agendar");
      return;
    }
    
    toast.success(`Agendamento solicitado para ${format(date, "PPP", { locale: ptBR })} às ${selectedTime}`);
  };
  
  const handleDismissPrompt = () => {
    setIsPromptVisible(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Service Provider/Public Toggle */}
      <PublicToggle 
        showPublicly={showPublicly} 
        onChange={setShowPublicly} 
      />
      
      {/* Marketing Prompt */}
      <MarketingPrompt 
        isPromptVisible={isPromptVisible} 
        onDismiss={handleDismissPrompt} 
      />
      
      {/* Service Scheduling Calendar */}
      <div className="grid md:grid-cols-2 gap-6">
        <ServiceDatePicker 
          selectedDate={date} 
          onDateSelect={setDate} 
        />
        
        <TimeSlotPicker 
          selectedDate={date}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          onSchedule={handleScheduleService}
          availableTimeSlots={availableTimeSlots}
        />
      </div>

      {/* Service Information */}
      <ServiceInformation />
    </div>
  );
};

export default ServiceSchedulingSection;
