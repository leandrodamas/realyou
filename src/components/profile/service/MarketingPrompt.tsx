
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MarketingPromptProps {
  isPromptVisible: boolean;
  onDismiss: () => void;
}

const MarketingPrompt: React.FC<MarketingPromptProps> = ({
  isPromptVisible,
  onDismiss,
}) => {
  if (!isPromptVisible) return null;

  return (
    <Card className="border-l-4 border-l-purple-600 bg-gradient-to-r from-purple-50 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            RealYou: Quando a Conectividade Encontra a Simplicidade
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
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
  );
};

export default MarketingPrompt;
