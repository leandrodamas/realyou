
import React from "react";
import { DollarSign, TrendingUp, Award, BadgeCheck, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ServicePackageDialog from "./ServicePackageDialog";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ServicePricing = () => {
  const handleSharePrice = () => {
    navigator.clipboard.writeText("R$ 150,00 ~ 180,00");
    toast.success("Preço copiado para a área de transferência!");
  }

  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DollarSign className="h-5 w-5 text-green-600 mr-3" />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Valor</h4>
          <Badge className="bg-amber-100 text-amber-700 border-0 cursor-pointer" onClick={handleSharePrice}>
            <TrendingUp className="h-3 w-3 mr-1" /> 
            Preço Dinâmico
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-600 font-medium">R$ 150,00 ~ 180,00</p>
          <Badge className="bg-blue-100 text-blue-700 border-0">Preço acessível</Badge>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Horário vazio</span>
            <span>Horário cheio</span>
          </div>
          <motion.div 
            className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full mt-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        </div>
        
        <div className="mt-3 space-y-2">
          <ServicePackageDialog />
          
          <div className="flex gap-2 mt-2 justify-around">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-purple-50 p-1 rounded-md text-xs text-purple-700 cursor-pointer"
              onClick={() => toast.success("Certificação verificada!")}
            >
              <BadgeCheck className="h-3 w-3 mr-1" />
              Certificado
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-blue-50 p-1 rounded-md text-xs text-blue-700 cursor-pointer"
              onClick={() => toast.success("Link copiado para compartilhar!")}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Compartilhar
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-amber-50 p-1 rounded-md text-xs text-amber-700 cursor-pointer"
              onClick={() => toast.success("Profissional premiado!")}
            >
              <Award className="h-3 w-3 mr-1" />
              Premiado
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicePricing;
