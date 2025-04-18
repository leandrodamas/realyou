
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppointmentType } from "./types";
import AppointmentHeader from "./appointment/AppointmentHeader";
import ClientInfo from "./appointment/ClientInfo";
import BookingActions from "./appointment/BookingActions";
import AppointmentDetails from "./appointment/AppointmentDetails";
import { getAppointmentColor } from "./appointment/utils";

interface AppointmentItemProps {
  appointment: AppointmentType;
  isSelected: boolean;
  showBookingActions: boolean;
  onTimeSelect: (time: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment, 
  isSelected, 
  showBookingActions,
  onTimeSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAvailable = appointment.type === "free";
  
  const handleClick = () => {
    if (isAvailable && showBookingActions) {
      onTimeSelect(appointment.time);
    } else if (appointment.type === "scheduled") {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <motion.div
      key={appointment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "border rounded-lg p-3 transition-all",
        getAppointmentColor(appointment.type, appointment.status),
        isSelected && "ring-2 ring-purple-400",
        (isAvailable && showBookingActions) || appointment.type === "scheduled" 
          ? "cursor-pointer hover:border-purple-300" 
          : ""
      )}
      onClick={handleClick}
    >
      <AppointmentHeader appointment={appointment} />
      
      <ClientInfo appointment={appointment} />
      
      {isAvailable && (
        <BookingActions 
          isSelected={isSelected} 
          showBookingActions={showBookingActions} 
        />
      )}
      
      {appointment.type === "scheduled" && (
        <AppointmentDetails 
          appointment={appointment} 
          isOpen={isOpen}
        />
      )}
    </motion.div>
  );
};

export default AppointmentItem;
