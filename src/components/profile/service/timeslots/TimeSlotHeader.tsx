
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

interface TimeSlotHeaderProps {
  realTimeViewers: number;
}

const TimeSlotHeader: React.FC<TimeSlotHeaderProps> = ({ realTimeViewers }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
          Horários disponíveis
        </CardTitle>
        
        {realTimeViewers > 0 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1"
          >
            <Users className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-purple-600">
              {realTimeViewers} {realTimeViewers === 1 ? 'pessoa' : 'pessoas'} online
            </span>
          </motion.div>
        )}
      </div>
    </CardHeader>
  );
};

export default TimeSlotHeader;
