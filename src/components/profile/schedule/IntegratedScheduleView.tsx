
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import TimeSlotPicker from "../service/TimeSlotPicker";
import ServiceDatePicker from "../service/ServiceDatePicker";
import ProfileHeader from "./components/ProfileHeader";
import { useAuth } from "@/hooks/useAuth";

interface IntegratedScheduleViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
  profileImage: string;
  name: string;
  basePrice: number;
  providerId?: string;
}

const IntegratedScheduleView: React.FC<IntegratedScheduleViewProps> = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
  profileImage,
  name,
  basePrice,
  providerId
}) => {
  const { user } = useAuth();
  
  const isDynamicPrice = useMemo(() => selectedDate && (
    selectedDate.getDay() === 1 ||
    selectedDate.getDay() === 5
  ), [selectedDate]);
  
  const finalPrice = useMemo(() => isDynamicPrice 
    ? Math.round(basePrice * 1.2) // 20% de aumento para dias de alta demanda
    : basePrice,
  [basePrice, isDynamicPrice]);

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <ProfileHeader 
          profileImage={profileImage}
          name={name}
          basePrice={basePrice}
          isDynamicPrice={Boolean(isDynamicPrice)}
          finalPrice={finalPrice}
        />

        <div className="md:col-span-2">
          <ServiceDatePicker
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            providerId={providerId || user?.id}
          />
        </div>

        <div className="md:col-span-1">
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
            onSchedule={onSchedule}
            availableTimeSlots={availableTimeSlots}
            providerId={providerId || user?.id}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default IntegratedScheduleView;
