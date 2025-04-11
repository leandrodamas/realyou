
import React, { useState } from "react";
import { Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AvailabilitySchedule from "../AvailabilitySchedule";

const AvailabilitySection: React.FC = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  
  return (
    <>
      <motion.div
        className="flex items-start cursor-pointer"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setShowSchedule(!showSchedule)}
      >
        <div className="bg-amber-100 p-2 rounded-full mr-3">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-medium">Horários de Atendimento</p>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">Clique para {showSchedule ? 'ocultar' : 'ver'} disponibilidade</p>
        </div>
      </motion.div>

      {showSchedule && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-12"
        >
          <AvailabilitySchedule />
        </motion.div>
      )}
    </>
  );
};

export default AvailabilitySection;
