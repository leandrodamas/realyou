
import React from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const ServicePackageDialog = () => {
  return (
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
  );
};

export default ServicePackageDialog;
