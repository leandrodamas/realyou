
import React from "react";
import { Shield } from "lucide-react";

const ServiceGuarantee = () => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <Shield className="h-4 w-4 text-green-600 mr-1" />
        <span className="text-sm font-medium">RealYou Garantia</span>
      </div>
      <p className="text-sm text-gray-600">
        Consultoria personalizada para desenvolvimento de software, arquitetura de sistemas e resolução de problemas técnicos. Satisfação garantida ou seu dinheiro de volta.
      </p>
    </div>
  );
};

export default ServiceGuarantee;
