
import React from "react";
import { DollarSign, TrendingUp, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Package className="h-3 w-3 mr-1" />
                Ver pacotes com desconto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pacotes Promocionais</DialogTitle>
                <DialogDescription>
                  Economize adquirindo um pacote de sessões
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 my-2">
                <div className="border rounded-md p-3 bg-purple-50 border-purple-200">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Pacote 3 + 1</h4>
                    <Badge className="bg-green-100 text-green-700">Economia de 25%</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">3 sessões + 1 sessão gratuita</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="font-medium">Total: R$ 540,00</span>
                    <span className="text-purple-600">R$ 180 por sessão</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Pacote Mensal</h4>
                    <Badge className="bg-amber-100 text-amber-700">Mais popular</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">5 sessões (uma por semana)</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="font-medium">Total: R$ 800,00</span>
                    <span className="text-purple-600">R$ 160 por sessão</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ServicePricing;
