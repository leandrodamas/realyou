
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AvailabilityFormProps {
  onComplete: () => void;
}

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

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
      
      <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium">Configure sua agenda!</span>
        </div>
        <p className="text-sm text-gray-600">
          Defina seus dias e horários disponíveis para atendimento.
          Isso ajudará seus clientes a encontrarem o melhor horário para marcar com você.
        </p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Dias da semana</h4>
        <div className="grid grid-cols-7 gap-1">
          {(Object.keys(dayLabels) as WeekDay[]).map((day) => (
            <div
              key={day}
              className={`text-center py-2 px-1 rounded-md cursor-pointer text-sm ${
                selectedDays.includes(day) 
                  ? 'bg-green-100 text-green-800 font-medium' 
                  : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => toggleDay(day)}
            >
              {dayLabels[day].substring(0, 3)}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Horários disponíveis</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <Label htmlFor="morning" className="text-sm">Manhã (8h - 12h)</Label>
            </div>
            <Switch 
              id="morning" 
              checked={timeSlots.morning}
              onCheckedChange={() => toggleTimeSlot('morning')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <Label htmlFor="afternoon" className="text-sm">Tarde (13h - 18h)</Label>
            </div>
            <Switch 
              id="afternoon" 
              checked={timeSlots.afternoon}
              onCheckedChange={() => toggleTimeSlot('afternoon')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <Label htmlFor="evening" className="text-sm">Noite (19h - 22h)</Label>
              <Badge variant="outline" className="text-xs">+15% valor</Badge>
            </div>
            <Switch 
              id="evening" 
              checked={timeSlots.evening}
              onCheckedChange={() => toggleTimeSlot('evening')}
            />
          </div>
        </div>
      </div>
      
      <Button
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={handleSyncCalendar}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Sincronizar com Google Agenda
      </Button>
      
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
