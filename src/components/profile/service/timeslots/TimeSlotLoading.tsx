
import React from "react";
import { Loader } from "lucide-react";

const TimeSlotLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader className="h-6 w-6 text-purple-600 animate-spin mb-2" />
      <p className="text-sm text-gray-500">Carregando horários...</p>
    </div>
  );
};

export default TimeSlotLoading;
