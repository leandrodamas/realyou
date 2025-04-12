
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Info, Users, AlertCircle, Zap, TrendingUp, Star, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onSchedule: () => void;
  availableTimeSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  onSchedule,
  availableTimeSlots,
}) => {
  const [viewingUsers, setViewingUsers] = useState<{[key: string]: number}>({
    "08:00": 2,
    "09:00": 3,
    "14:00": 1,
  });
  
  const [showPackages, setShowPackages] = useState(false);
  
  // Dynamic pricing model
  const dynamicPriceSlots = {
    "09:00": 180, // Normal price
    "10:00": 220, // +20% (high demand)
    "14:00": 150, // -15% (low demand)
    "15:00": 180, // Normal price
  };
  
  const getBasePrice = () => 180; // R$180 is the base price
  
  const getTimeSlotPrice = (time: string) => {
    return dynamicPriceSlots[time] || getBasePrice();
  };
  
  const handleScheduleClick = () => {
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário");
      return;
    }
    
    if (showPackages) {
      toast.success("Pacote selecionado com sucesso! Aguardando confirmação.");
    } else {
      onSchedule();
    }
  };

  const getTimeslotDemand = (time: string): "high" | "medium" | "low" => {
    const viewers = viewingUsers[time] || 0;
    if (viewers >= 3) return "high";
    if (viewers >= 1) return "medium";
    return "low";
  };
  
  const isDynamicallyPriced = (time: string) => {
    const basePrice = getBasePrice();
    const price = getTimeSlotPrice(time);
    return price !== basePrice;
  };
  
  const getPriceLabel = (time: string) => {
    const price = getTimeSlotPrice(time);
    const basePrice = getBasePrice();
    
    if (price > basePrice) {
      return `R$${price} (+${Math.round((price/basePrice - 1) * 100)}%)`;
    }
    else if (price < basePrice) {
      return `R$${price} (-${Math.round((1 - price/basePrice) * 100)}%)`;
    }
    return `R$${price}`;
  };
  
  const handlePackageSelect = () => {
    setShowPackages(!showPackages);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Horários disponíveis
            {selectedDate ? (
              <span className="ml-2 text-sm font-normal text-gray-500">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </span>
            ) : null}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "bg-purple-50 hover:bg-purple-100",
                    showPackages && "bg-purple-100 text-purple-700"
                  )}
                  onClick={handlePackageSelect}
                >
                  <Package className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver pacotes promocionais</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDate ? (
          <div>
            {!showPackages ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((time) => {
                    const demand = getTimeslotDemand(time);
                    const isDynamic = isDynamicallyPriced(time);
                    const priceLabel = getPriceLabel(time);
                    
                    return (
                      <div key={time} className="relative">
                        <Button
                          variant={selectedTime === time ? "default" : "outline"}
                          className={cn(
                            "h-10 w-full relative",
                            selectedTime === time && "bg-purple-600 hover:bg-purple-700"
                          )}
                          onClick={() => onTimeSelect(time)}
                        >
                          {time}
                          {demand === "high" && (
                            <div className="absolute -top-1 -right-1">
                              <div className="flex items-center bg-red-500 text-white text-[10px] rounded-full px-1 animate-pulse">
                                <Users className="h-2 w-2 mr-0.5" />
                                {viewingUsers[time]}
                              </div>
                            </div>
                          )}
                        </Button>
                        {isDynamic && (
                          <div className="mt-1 text-center text-[10px]">
                            <span className={cn(
                              "font-medium",
                              getTimeSlotPrice(time) > getBasePrice() ? "text-rose-600" : "text-green-600"
                            )}>
                              {priceLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Urgent booking indicator */}
                <div className="mt-3">
                  {viewingUsers["08:00"] > 0 && (
                    <div className="flex items-center text-xs text-amber-600 animate-pulse">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>3 pessoas estão vendo estes horários agora!</span>
                    </div>
                  )}
                  
                  {selectedTime && getTimeslotDemand(selectedTime) === "high" && (
                    <div className="flex items-center justify-between mt-2 p-2 bg-amber-50 rounded-md">
                      <div className="flex items-center text-xs text-amber-700">
                        <Zap className="h-3 w-3 mr-1" />
                        <span>Alta procura! Agende já para garantir seu horário</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTime && isDynamicallyPriced(selectedTime) && (
                    <div className="flex items-center justify-between mt-2 p-2 bg-purple-50 rounded-md">
                      <div className="flex items-center text-xs text-purple-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>
                          {getTimeSlotPrice(selectedTime) > getBasePrice() 
                            ? "Preço dinâmico (alta demanda)" 
                            : "Desconto especial (horário com menos procura)"}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn(
                        getTimeSlotPrice(selectedTime) > getBasePrice() 
                          ? "bg-rose-50 text-rose-700 border-rose-200" 
                          : "bg-green-50 text-green-700 border-green-200"
                      )}>
                        {getPriceLabel(selectedTime)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="grid gap-3">
                  <div 
                    className={cn(
                      "border rounded-lg p-3 cursor-pointer hover:border-purple-300 transition-all",
                      "border-purple-200 bg-purple-50"
                    )}
                    onClick={() => {
                      toast.success("Pacote de 3 sessões selecionado!");
                      setShowPackages(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-purple-200 p-2 rounded-md">
                          <Package className="h-5 w-5 text-purple-700" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-sm">Pacote 3 + 1</h4>
                          <p className="text-xs text-gray-600">3 sessões + 1 grátis</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100">
                        Economize 25%
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>Valor total:</span>
                        <span className="font-medium">R$ 540,00</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Pagamento inicial:</span>
                        <span className="font-medium text-purple-700">R$ 270,00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg p-3 cursor-pointer hover:border-purple-300 transition-all"
                    onClick={() => {
                      toast.success("Pacote de 5 sessões selecionado!");
                      setShowPackages(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-amber-200 p-2 rounded-md">
                          <Star className="h-5 w-5 text-amber-700" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-sm">Pacote Premium</h4>
                          <p className="text-xs text-gray-600">5 sessões consecutivas</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100">
                        Mais popular
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>Valor total:</span>
                        <span className="font-medium">R$ 900,00</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Pagamento inicial:</span>
                        <span className="font-medium text-amber-700">R$ 360,00</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full text-purple-600 border border-purple-300"
                  onClick={() => setShowPackages(false)}
                >
                  Voltar para horários avulsos
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={handleScheduleClick} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] font-medium"
                size="lg"
                disabled={!selectedTime && !showPackages}
              >
                {showPackages ? "Selecionar Pacote" : "Agendar Agora"}
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-2">
                Cancelamento gratuito até 24h antes
              </p>
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
  );
};

export default TimeSlotPicker;
