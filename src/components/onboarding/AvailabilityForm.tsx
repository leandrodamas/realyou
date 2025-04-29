
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AvailabilityFormProps, WeekDay } from "./availability/types";
import WeekDaySelector from "./availability/WeekDaySelector";
import TimeSlotSelector from "./availability/TimeSlotSelector";
import CalendarSyncButton from "./availability/CalendarSyncButton";
import AvailabilityInfoBox from "./availability/AvailabilityInfoBox";

const dayLabels: Record<WeekDay, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo"
};

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onComplete }) => {
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>(["monday", "wednesday", "friday"]);
  const [timeSlots, setTimeSlots] = useState({
    morning: true,
    afternoon: true,
    evening: false
  });
  
  const toggleDay = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleTimeSlot = (slot: keyof typeof timeSlots) => {
    setTimeSlots({
      ...timeSlots,
      [slot]: !timeSlots[slot]
    });
  };

  const handleSyncCalendar = () => {
    toast.success("Sincronização com calendário iniciada");
    setTimeout(() => {
      toast.success("Calendário sincronizado com sucesso!");
    }, 1500);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Disponibilidade</h3>
      
      <AvailabilityInfoBox />
      
      <WeekDaySelector 
        selectedDays={selectedDays} 
        onToggleDay={toggleDay}
        dayLabels={dayLabels}
      />
      
      <TimeSlotSelector 
        timeSlots={timeSlots}
        onToggleTimeSlot={toggleTimeSlot}
      />
      
      <CalendarSyncButton onSync={handleSyncCalendar} />
      
      <div className="pt-4">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={onComplete}
        >
          Concluir
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
