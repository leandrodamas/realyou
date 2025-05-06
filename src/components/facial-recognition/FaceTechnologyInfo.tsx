
import React from "react";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

const FaceTechnologyInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg flex items-center gap-1.5 mb-3">
        <Sparkles className="h-5 w-5 text-purple-500" />
        Tecnologia de Reconhecimento Facial
      </h3>
      
      <div className="space-y-3 text-sm text-gray-600">
        <p>
          O RealYou utiliza tecnologia avançada de reconhecimento facial para ajudar você a encontrar pessoas registradas no aplicativo.
        </p>
        <p>
          Nossa tecnologia analisa pontos de referência faciais para identificar correspondências precisas em nosso banco de dados.
        </p>
        <p>
          Fornecemos uma lista de pessoas com características faciais semelhantes, permitindo que você conecte-se facilmente com elas.
        </p>
      </div>
    </div>
  );
};

export default FaceTechnologyInfo;
