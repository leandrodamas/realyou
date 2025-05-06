
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

interface ScheduleSuccessDrawerProps {
  date?: Date;
  selectedTime: string | null;
  providerName?: string;
}

const ScheduleSuccessDrawer: React.FC<ScheduleSuccessDrawerProps> = ({
  date,
  selectedTime,
  providerName = "Dr. Carlos Silva"
}) => {
  return (
    <DrawerContent className="px-6">
      <DrawerHeader>
        <DrawerTitle className="text-center text-purple-700">Agendamento Enviado!</DrawerTitle>
        <DrawerDescription className="text-center">
          O profissional receberá uma notificação para confirmar
        </DrawerDescription>
      </DrawerHeader>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-6"
      >
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
        
        <h3 className="font-semibold mt-4">{providerName}</h3>
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
      </motion.div>
      
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">Fechar</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default ScheduleSuccessDrawer;
