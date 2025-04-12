
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ArrowRight } from "lucide-react";

interface PersonalInfoFormProps {
  onComplete: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete }) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Informações Básicas</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <Input placeholder="Seu nome completo" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título Profissional
        </label>
        <Input placeholder="Ex: Designer UX/UI Senior" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto de Perfil
        </label>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
          <Button variant="outline" size="sm">
            Fazer Upload
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Uma boa foto de perfil aumenta as chances de conexões em 80%
        </p>
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

export default PersonalInfoForm;
