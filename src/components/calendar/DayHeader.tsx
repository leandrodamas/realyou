
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface DayHeaderProps {
  selectedDate: Date;
}

const DayHeader: React.FC<DayHeaderProps> = ({ selectedDate }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Calendar className="h-5 w-5 text-purple-600" />
      <h4 className="font-medium">
        {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </h4>
    </div>
  );
};

export default DayHeader;
