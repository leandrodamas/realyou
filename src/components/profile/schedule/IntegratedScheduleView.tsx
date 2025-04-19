
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TimeSlotPicker from "../service/TimeSlotPicker";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IntegratedScheduleViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
  profileImage?: string;
  name: string;
  basePrice: number;
}

const IntegratedScheduleView: React.FC<IntegratedScheduleViewProps> = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
  profileImage,
  name,
  basePrice,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Profissional Selecionado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 ring-2 ring-purple-200">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Disponível hoje
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <DollarSign className="h-3 w-3 mr-1" />
                  R${basePrice}/hora
                </Badge>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">
                    {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                {selectedTime && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span>{selectedTime}</span>
                  </div>
                )}
              </div>

              {selectedTime && (
                <div>
                  <h4 className="font-medium mb-2">Resumo do agendamento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor base</span>
                      <span>R${basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duração</span>
                      <span>1 hora</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-purple-600">R${basePrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TimeSlotPicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
        onSchedule={onSchedule}
        availableTimeSlots={availableTimeSlots}
      />
    </div>
  );
};

export default IntegratedScheduleView;
