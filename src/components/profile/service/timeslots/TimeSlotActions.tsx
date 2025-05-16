
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";

interface TimeSlotActionsProps {
  selectedTime: string | null;
  onSchedule: () => void;
  hasViewers: boolean;
  maxViewers: number;
}

const TimeSlotActions: React.FC<TimeSlotActionsProps> = ({
  selectedTime,
  onSchedule,
  hasViewers,
  maxViewers
}) => {
  return (
    <>
      {hasViewers && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center text-xs text-amber-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{maxViewers} pessoas estão vendo estes horários agora!</span>
          </div>
        </motion.div>
      )}
      
      <div className="mt-4 space-y-2">
        <Button 
          onClick={onSchedule} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
          disabled={!selectedTime}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Agora
        </Button>
        
        <Badge variant="outline" className="w-full flex justify-center text-xs text-green-700 bg-green-50 border-green-100">
          Cancelamento gratuito até 24h antes
        </Badge>
      </div>
    </>
  );
};

export default TimeSlotActions;
