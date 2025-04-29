
import React, { useState } from "react";
import { Package, Share2, Award, BadgeCheck, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  
  const handleShare = (packageName: string) => {
    navigator.clipboard.writeText(`Confira este pacote: ${packageName}`);
    toast.success("Link do pacote copiado!");
  };
  
  const handleCertificationClick = () => {
    toast.success("Certificação verificada com sucesso!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full text-xs">
          <Package className="h-3 w-3 mr-1" />
          Ver pacotes com desconto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pacotes Promocionais</DialogTitle>
          <DialogDescription>
            Economize adquirindo um pacote de sessões
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 my-2">
          <motion.div 
            className={`border rounded-md p-3 bg-purple-50 border-purple-200 cursor-pointer ${selectedPackage === 'pacote3+1' ? 'ring-2 ring-purple-400' : ''}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPackage('pacote3+1')}
          >
            <div className="flex justify-between">
              <h4 className="font-medium">Pacote 3 + 1</h4>
              <Badge className="bg-green-100 text-green-700">Economia de 25%</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">3 sessões + 1 sessão gratuita</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className="font-medium">Total: R$ 540,00</span>
              <span className="text-purple-600">R$ 180 por sessão</span>
            </div>
            
            <div className="flex gap-2 mt-3 justify-end">
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleShare("Pacote 3+1")}>
                <Share2 className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={handleCertificationClick}>
                <BadgeCheck className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className={`border rounded-md p-3 cursor-pointer ${selectedPackage === 'pacoteMensal' ? 'ring-2 ring-purple-400' : ''}`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPackage('pacoteMensal')}
          >
            <div className="flex justify-between">
              <h4 className="font-medium">Pacote Mensal</h4>
              <Badge className="bg-amber-100 text-amber-700">Mais popular</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">5 sessões (uma por semana)</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className="font-medium">Total: R$ 800,00</span>
              <span className="text-purple-600">R$ 160 por sessão</span>
            </div>
            
            <div className="flex gap-2 mt-3 justify-end">
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleShare("Pacote Mensal")}>
                <Share2 className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={handleCertificationClick}>
                <Badge className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center mt-4 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => toast.success("Compartilhado nas redes sociais!")}
          >
            <LinkIcon className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium">Integrar com redes sociais</span>
          </motion.div>
        </div>
        <DialogFooter>
          {selectedPackage && (
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-500"
              onClick={() => {
                toast.success("Pacote selecionado com sucesso!");
              }}
            >
              Selecionar Pacote
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServicePackageDialog;
