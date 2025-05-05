
import React from "react";
import { motion } from "framer-motion";
import TimeSlotPicker from "../service/TimeSlotPicker";
import ServiceDatePicker from "../service/ServiceDatePicker";
import { Card, CardContent } from "@/components/ui/card";

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
}) => {
  const isDynamicPrice = selectedDate && (
    selectedDate.getDay() === 1 ||
    selectedDate.getDay() === 5
  );
  
  const finalPrice = isDynamicPrice 
    ? Math.round(basePrice * 1.2) // 20% de aumento para dias de alta demanda
    : basePrice;

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Perfil do profissional e preço */}
        <Card className="md:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={profileImage}
                  alt={name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-purple-200"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{name}</h3>
                <div className="text-sm text-gray-500">Consultor(a) Profissional</div>
                <div className="mt-1 flex items-center">
                  <span className="font-semibold">R$ {finalPrice},00</span>
                  {isDynamicPrice && (
                    <span className="ml-2 text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      Alta demanda (+20%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seleção de data */}
        <div className="md:col-span-2">
          <ServiceDatePicker
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        </div>

        {/* Seleção de horário */}
        <div className="md:col-span-1">
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
            onSchedule={onSchedule}
            availableTimeSlots={availableTimeSlots}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default IntegratedScheduleView;
