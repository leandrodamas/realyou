
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MatchedPerson } from "./types/MatchedPersonTypes";
import PersonHeader from "./schedule/PersonHeader";
import ScheduleList from "./schedule/ScheduleList";

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
          <PersonHeader matchedPerson={matchedPerson} />
          
          <div>
            <h4 className="text-sm font-medium mb-3">Disponibilidade Semanal</h4>
            <ScheduleList schedule={matchedPerson.schedule} />
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
