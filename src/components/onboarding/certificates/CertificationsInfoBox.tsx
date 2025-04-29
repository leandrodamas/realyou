
import React from "react";
import { Award } from "lucide-react";

const CertificationsInfoBox: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
      <div className="flex items-center mb-2">
        <Award className="h-5 w-5 text-amber-600 mr-2" />
        <span className="font-medium">Destaque suas credenciais!</span>
      </div>
      <p className="text-sm text-gray-600">
        Adicione suas certificações profissionais e cursos para comprovar suas habilidades.
        Certificações verificadas aumentam em 70% as chances de conversão.
      </p>
    </div>
  );
};

export default CertificationsInfoBox;
