
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarClock, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

const ServiceSchedulingSection: React.FC = () => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  
  // Available time slots for the selected date
  const availableTimeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];
  
  const handleScheduleService = () => {
    if (!date || !selectedTime) {
      toast.error("Por favor, selecione data e horário para agendar");
      return;
    }
    
    toast.success(`Agendamento solicitado para ${format(date, "PPP", { locale: ptBR })} às ${selectedTime}`);
  };
  
  const handleDismissPrompt = () => {
    setIsPromptVisible(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Service Provider/Public Toggle */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h3 className="font-medium">Mostrar serviços publicamente</h3>
          <p className="text-sm text-gray-500">Permite que outros usuários vejam seus serviços e disponibilidade</p>
        </div>
        <Switch
          checked={showPublicly}
          onCheckedChange={setShowPublicly}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>
      
      {/* Marketing Prompt */}
      {isPromptVisible && (
        <Card className="border-l-4 border-l-purple-600 bg-gradient-to-r from-purple-50 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                RealYou: Quando a Conectividade Encontra a Simplicidade
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleDismissPrompt}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Para Quem Busca um Serviço:</h4>
                <p className="text-sm text-gray-600">
                  Encontre profissionais qualificados com agendas claras e disponibilidade em tempo real.
                  Sem intermediários, sem enrolação.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Para Quem Oferece um Serviço:</h4>
                <p className="text-sm text-gray-600">
                  Crie um perfil completo, defina horários de trabalho e deixe que os clientes marquem diretamente na sua agenda.
                  A RealYou cuida dos lembretes, reduzindo faltas.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-purple-50">
                  <Clock className="mr-1 h-3 w-3" /> Agenda em Tempo Real
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  Perfis Verificados
                </Badge>
                <Badge variant="outline" className="bg-green-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M10 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/><path d="M12 2a8 8 0 1 0 8 8 4 4 0 1 1 0 8H4a4 4 0 1 1 0-8 8 8 0 0 0 8-8"/></svg>
                  Lembretes Inteligentes
                </Badge>
                <Badge variant="outline" className="bg-amber-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"/><path d="M12 18v2m0-16v2"/></svg>
                  Pagamento Seguro
                </Badge>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="default" className="bg-gradient-to-r from-purple-600 to-blue-500">
                  Buscar um Serviço
                </Button>
                <Button variant="outline" className="border-purple-200">
                  Oferecer um Serviço
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Service Scheduling Calendar */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarClock className="h-5 w-5 mr-2 text-purple-600" />
              Selecione uma data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border pointer-events-auto"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-600" />
              Horários disponíveis
              {date ? (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {date ? (
              <div>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "h-10",
                        selectedTime === time && "bg-purple-600 hover:bg-purple-700"
                      )}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleScheduleService} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
                  >
                    Solicitar Agendamento
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Info className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">Selecione uma data para ver os horários disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Tipo de Serviço</h4>
              <p className="text-gray-600">Consultoria de Software</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Duração</h4>
              <p className="text-gray-600">1 hora</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Valor</h4>
              <p className="text-gray-600">R$ 150,00</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium">Local</h4>
              <p className="text-gray-600">Online (via chamada de vídeo)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSchedulingSection;
