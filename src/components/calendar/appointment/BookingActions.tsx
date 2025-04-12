
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingActionsProps {
  isSelected: boolean;
  showBookingActions: boolean;
}

const BookingActions: React.FC<BookingActionsProps> = ({ 
  isSelected,
  showBookingActions
}) => {
  if (!isSelected || !showBookingActions) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-3 pt-3 border-t border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-sm">
          <AlertCircle className="h-4 w-4 text-purple-600 mr-1" />
          <span className="text-purple-700 font-medium">Horário disponível</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Valor</p>
          <p className="font-semibold text-purple-700">R$180</p>
        </div>
      </div>
      <Button className="w-full bg-purple-600 hover:bg-purple-700">
        <Calendar className="h-4 w-4 mr-2" />
        Agendar este horário
      </Button>
    </motion.div>
  );
};

export default BookingActions;
