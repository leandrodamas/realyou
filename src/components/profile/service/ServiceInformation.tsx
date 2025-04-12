
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, MapPin, Award, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ServiceInformation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Informações do Serviço</span>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            4.9
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Consultoria de Software</h4>
              <p className="text-xs text-gray-500">Superstar • Escolha da Semana</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium">Duração</h4>
              <p className="text-gray-600">1 hora</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium">Valor</h4>
              <div className="flex items-center gap-2">
                <p className="text-gray-600 font-medium">R$ 150,00</p>
                <Badge className="bg-blue-100 text-blue-700 border-0">Preço acessível</Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h4 className="font-medium">Local</h4>
              <p className="text-gray-600">Online (via chamada de vídeo)</p>
            </div>
          </div>
          
          <div className="mt-2 bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Sobre este serviço:</span> Consultoria personalizada para desenvolvimento de software, arquitetura de sistemas e resolução de problemas técnicos.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
