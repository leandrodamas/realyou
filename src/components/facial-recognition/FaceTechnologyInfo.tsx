
import React from "react";
import { motion } from "framer-motion";
import { Info, Sparkles, Zap, Cpu, Shield } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaceTechnologyInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Tecnologia de Reconhecimento</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="precision">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Precisão Profissional</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">
              Nossa tecnologia utiliza algoritmos avançados de reconhecimento facial, 
              semelhantes aos utilizados em sistemas de segurança bancária. A precisão é mantida 
              mesmo em condições de iluminação variável.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="offline">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>Funcionamento Offline</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">
              O RealYou processa seu reconhecimento facial diretamente no dispositivo,
              sem necessidade de conexão com a internet para as funções básicas de identificação.
              Seus dados biométricos permanecem no seu celular.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="distance">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-500" />
              <span>Reconhecimento à Distância</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">
              Nossa tecnologia consegue reconhecer rostos a uma distância de até 2 metros,
              dependendo da resolução da câmera do seu dispositivo. Quanto melhor a câmera,
              maior a precisão e alcance do reconhecimento.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="learning">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Aprendizado Contínuo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600">
              O sistema de reconhecimento facial do RealYou melhora a cada uso.
              Com aprendizado contínuo, o algoritmo se adapta às mudanças sutis em sua 
              aparência ao longo do tempo, mantendo a precisão mesmo quando você muda o 
              visual, usa óculos ou cresce barba.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FaceTechnologyInfo;
