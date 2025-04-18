
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineNavigationProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const TimelineNavigation: React.FC<TimelineNavigationProps> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <div className="border-b px-4 py-3 flex items-center justify-between">
      <div>
        <h3 className="font-medium">Calendário</h3>
        <p className="text-sm text-gray-500">
          {format(currentDate, "MMMM yyyy", { locale: ptBR })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onPrevWeek}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onNextWeek}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimelineNavigation;
