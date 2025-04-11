
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ServiceInformation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Tipo de Serviço</h4>
            <p className="text-gray-600">Consultoria de Software</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Duração</h4>
            <p className="text-gray-600">1 hora</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Valor</h4>
            <p className="text-gray-600">R$ 150,00</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium">Local</h4>
            <p className="text-gray-600">Online (via chamada de vídeo)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
