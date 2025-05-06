
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { MatchedPerson } from "./types/MatchedPersonTypes";

interface ScheduleDialogProps {
  showDialog: boolean;
  matchedPerson: MatchedPerson;
  onCloseDialog: () => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  showDialog,
  matchedPerson,
  onCloseDialog,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agenda de {matchedPerson.name}</DialogTitle>
          <DialogDescription>
            Horários disponíveis para agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {matchedPerson.schedule?.map((day) => (
            <div key={day.day} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{day.day}</p>
                <Badge variant={day.active ? "default" : "outline"}>
                  {day.active ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
              {day.active && day.slots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <Badge
                      key={slot}
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1 bg-purple-50"
                    >
                      <Clock className="h-3 w-3" />
                      {slot}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {day.active
                    ? "Sem horários disponíveis"
                    : "Indisponível neste dia"}
                </p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
