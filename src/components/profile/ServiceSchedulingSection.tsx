
import React, { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Heart, X, MessageCircle, Award, Bell, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Import refactored components
import PublicToggle from "./service/PublicToggle";
import MarketingPrompt from "./service/MarketingPrompt";
import ServiceDatePicker from "./service/ServiceDatePicker";
import TimeSlotPicker from "./service/TimeSlotPicker";
import ServiceInformation from "./service/ServiceInformation";

const ServiceSchedulingSection: React.FC = () => {
  const [showPublicly, setShowPublicly] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);
  
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
    
    // Show match success drawer
    setShowMatchSuccess(true);
  };
  
  const handleDismissPrompt = () => {
    setIsPromptVisible(false);
  };
  
  // New swipe functionality for professional profiles
  const [professionalIndex, setProfessionalIndex] = useState(0);
  const [showSwipe, setShowSwipe] = useState(false);
  
  // Mock professional data
  const professionals = [
    {
      id: 1,
      name: "Dr. Carlos Silva",
      title: "Desenvolvedor Senior",
      rating: 4.9,
      reviews: 132,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      price: 180,
      availability: "Hoje e amanhã",
    },
    {
      id: 2,
      name: "Dra. Maria Souza",
      title: "Arquiteta de Software",
      rating: 4.8,
      reviews: 98,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      price: 190,
      availability: "A partir de amanhã",
    },
    {
      id: 3,
      name: "João Mendes",
      title: "UI/UX Designer & Dev",
      rating: 4.7,
      reviews: 76,
      image: "https://randomuser.me/api/portraits/men/68.jpg",
      price: 170,
      availability: "Disponível hoje",
    }
  ];
  
  const handleSwipeRight = () => {
    toast.success(`Você demonstrou interesse em ${professionals[professionalIndex].name}!`);
    if (professionalIndex < professionals.length - 1) {
      setProfessionalIndex(professionalIndex + 1);
    } else {
      toast("Você viu todos os profissionais disponíveis");
      setShowSwipe(false);
    }
  };
  
  const handleSwipeLeft = () => {
    if (professionalIndex < professionals.length - 1) {
      setProfessionalIndex(professionalIndex + 1);
    } else {
      toast("Você viu todos os profissionais disponíveis");
      setShowSwipe(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Service Provider/Public Toggle */}
      <PublicToggle 
        showPublicly={showPublicly} 
        onChange={setShowPublicly} 
      />
      
      {/* Marketing Prompt */}
      <MarketingPrompt 
        isPromptVisible={isPromptVisible} 
        onDismiss={handleDismissPrompt} 
      />
      
      {/* "Match" style professional finder - NEW */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Encontre seu profissional ideal</h3>
            <p className="text-sm text-gray-500">Deslize para direita nos perfis que te interessam</p>
          </div>
          <Button 
            onClick={() => setShowSwipe(true)} 
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            Explorar agora
          </Button>
        </div>
        
        {/* Preview of available professionals */}
        <div className="flex -space-x-4 overflow-hidden mt-2">
          {professionals.map((pro, i) => (
            <img 
              key={pro.id}
              src={pro.image} 
              alt={pro.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ))}
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white">
            <span className="text-xs text-purple-700">+5</span>
          </div>
        </div>
      </div>
      
      {/* Service Scheduling Calendar */}
      <div className="grid md:grid-cols-2 gap-6">
        <ServiceDatePicker 
          selectedDate={date} 
          onDateSelect={setDate} 
        />
        
        <TimeSlotPicker 
          selectedDate={date}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          onSchedule={handleScheduleService}
          availableTimeSlots={availableTimeSlots}
        />
      </div>

      {/* Service Information */}
      <ServiceInformation />
      
      {/* Match Success Drawer */}
      <Drawer open={showMatchSuccess} onOpenChange={setShowMatchSuccess}>
        <DrawerContent className="px-6">
          <DrawerHeader>
            <DrawerTitle className="text-center text-purple-700">Agendamento Enviado!</DrawerTitle>
            <DrawerDescription className="text-center">
              O profissional receberá uma notificação para confirmar
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col items-center py-6">
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Professional" 
                className="w-24 h-24 rounded-full border-4 border-purple-100 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                <Bell className="h-3 w-3 text-white" />
              </div>
            </div>
            
            <h3 className="font-semibold mt-4">Dr. Carlos Silva</h3>
            <p className="text-sm text-gray-600">Desenvolvedor Senior</p>
            
            <div className="bg-purple-50 w-full rounded-lg p-4 mt-6 text-center">
              <p className="text-sm">
                <span className="font-medium">Data e horário:</span> {date && format(date, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Valor:</span> R$ 180,00
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 mt-6 w-full">
              <Button className="flex-1 bg-white text-purple-600 border border-purple-300 hover:bg-purple-50">
                <MessageCircle className="h-4 w-4 mr-1" />
                Enviar mensagem
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Ver detalhes
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              Você receberá uma notificação quando o profissional confirmar o agendamento
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Professional Swipe Interface */}
      <Drawer open={showSwipe} onOpenChange={setShowSwipe}>
        <DrawerContent className="px-4 pb-6">
          <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-3"></div>
          <div className="relative h-[500px] max-w-md mx-auto">
            {professionals.length > 0 && professionalIndex < professionals.length && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white rounded-xl overflow-hidden border shadow-md"
              >
                <div className="relative h-3/5 bg-gray-100">
                  <img 
                    src={professionals[professionalIndex].image} 
                    alt={professionals[professionalIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/80 backdrop-blur-sm text-purple-700 border-0">
                      <Award className="h-3 w-3 mr-1" />
                      Top profissional
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="font-semibold text-xl text-white">{professionals[professionalIndex].name}</h3>
                    <p className="text-white/90">{professionals[professionalIndex].title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{professionals[professionalIndex].rating}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({professionals[professionalIndex].reviews} avaliações)
                      </span>
                    </div>
                    <span className="font-semibold">R$ {professionals[professionalIndex].price}</span>
                  </div>
                  
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {professionals[professionalIndex].availability}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 flex justify-center gap-6">
                    <Button 
                      onClick={handleSwipeLeft} 
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400"
                    >
                      <X className="h-5 w-5 text-red-500" />
                    </Button>
                    
                    <Button 
                      onClick={handleSwipeRight} 
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400"
                    >
                      <Heart className="h-5 w-5 text-pink-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ServiceSchedulingSection;
