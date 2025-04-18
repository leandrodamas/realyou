
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MatchedPerson } from "./types/MatchedPersonTypes";

interface ScheduleDialogProps {
  showDialog: boolean;
  matchedPerson: MatchedPerson | null;
  onCloseDialog: () => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  showDialog,
  matchedPerson,
  onCloseDialog,
}) => {
  if (!matchedPerson) return null;

  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Horários de Atendimento</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <img 
              src={matchedPerson.avatar} 
              alt={matchedPerson.name} 
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{matchedPerson.name}</h3>
              <p className="text-xs text-gray-500">{matchedPerson.profession}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Disponibilidade Semanal</h4>
            <div className="space-y-3">
              {matchedPerson.schedule
                .filter(day => day.active)
                .map((day, index) => (
                <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
                  <p className="text-sm font-medium">{day.day}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {day.slots.map((slot, slotIndex) => (
                      <Button
                        key={slotIndex}
                        variant="secondary"
                        className="text-xs h-7 px-2"
                        size="sm"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={onCloseDialog}
              className="bg-gradient-to-r from-purple-600 to-blue-500"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
