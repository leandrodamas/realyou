
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TimeSlot {
  day: string;
  slots: string[];
  active: boolean;
}

const AvailabilitySchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<TimeSlot[]>([
    { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
    { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
    { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
    { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
    { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
    { day: "Sábado", slots: ["10:00 - 14:00"], active: false },
    { day: "Domingo", slots: [], active: false },
  ]);

  const [editingSchedule, setEditingSchedule] = useState<TimeSlot[]>([...schedule]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleDayActive = (dayIndex: number) => {
    const newSchedule = [...editingSchedule];
    newSchedule[dayIndex].active = !newSchedule[dayIndex].active;
    setEditingSchedule(newSchedule);
  };

  const saveSchedule = () => {
    setSchedule([...editingSchedule]);
    setIsDialogOpen(false);
    toast.success("Horários atualizados com sucesso!");
  };

  const resetSchedule = () => {
    setEditingSchedule([...schedule]);
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Disponibilidade Semanal</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">Editar Horários</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Definir Horários de Atendimento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {editingSchedule.map((day, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`day-${index}`}
                    checked={day.active}
                    onCheckedChange={() => toggleDayActive(index)}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`day-${index}`}
                      className={`font-medium ${day.active ? "" : "text-gray-400"}`}
                    >
                      {day.day}
                    </Label>
                    {day.active && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {day.slots.map((slot, slotIndex) => (
                          <Badge
                            key={slotIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetSchedule}>Cancelar</Button>
                <Button onClick={saveSchedule}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {schedule.filter(day => day.active).map((day, index) => (
          <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
            <p className="text-sm font-medium">{day.day}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {day.slots.map((slot, slotIndex) => (
                <Badge
                  key={slotIndex}
                  variant="secondary"
                  className="text-xs"
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {schedule.filter(day => day.active).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum horário disponível
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySchedule;
