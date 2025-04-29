
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { CalendarSyncButtonProps } from "./types";

const CalendarSyncButton: React.FC<CalendarSyncButtonProps> = ({ onSync }) => {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center"
      onClick={onSync}
    >
      <Calendar className="h-4 w-4 mr-2" />
      Sincronizar com Google Agenda
    </Button>
  );
};

export default CalendarSyncButton;
