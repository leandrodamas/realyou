
import React from "react";
import { Calendar } from "lucide-react";

const AvailabilityInfoBox: React.FC = () => {
  return (
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
  );
};

export default AvailabilityInfoBox;
