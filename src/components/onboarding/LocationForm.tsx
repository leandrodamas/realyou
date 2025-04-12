
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight } from "lucide-react";

interface LocationFormProps {
  onComplete: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onComplete }) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Localização</h3>
      
      <div className="bg-gray-50 border rounded-lg p-3 mb-3">
        <div className="flex items-center mb-2">
          <MapPin className="h-5 w-5 text-purple-500 mr-2" />
          <span className="font-medium">Localização é importante!</span>
        </div>
        <p className="text-sm text-gray-600">
          Clientes buscam profissionais próximos. Sua localização ajuda no match perfeito.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <Input placeholder="Rua, número" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <Input placeholder="Sua cidade" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <Input placeholder="Seu estado" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CEP
        </label>
        <Input placeholder="00000-000" />
      </div>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={onComplete}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LocationForm;
