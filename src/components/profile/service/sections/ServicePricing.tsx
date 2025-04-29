
import React from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ServicePackageDialog from "./ServicePackageDialog";

const ServicePricing = () => {
  return (
    <div className="flex items-center">
      <DollarSign className="h-5 w-5 text-green-600 mr-3" />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Valor</h4>
          <Badge className="bg-amber-100 text-amber-700 border-0">
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
          <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full mt-1"></div>
        </div>
        
        <div className="mt-3">
          <ServicePackageDialog />
        </div>
      </div>
    </div>
  );
};

export default ServicePricing;
