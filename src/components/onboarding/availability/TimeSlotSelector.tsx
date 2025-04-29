
import React from "react";
import { Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TimeSlotSelectorProps } from "./types";

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  timeSlots, 
  onToggleTimeSlot 
}) => {
  return (
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
            onCheckedChange={() => onToggleTimeSlot('morning')}
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
            onCheckedChange={() => onToggleTimeSlot('afternoon')}
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
            onCheckedChange={() => onToggleTimeSlot('evening')}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
