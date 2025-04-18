
import React from "react";
import { AlertCircle } from "lucide-react";

export const SecurityNotice = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 border border-blue-200 mt-4">
      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
      <p className="text-xs text-blue-700">
        Seus dados de cartão são criptografados e armazenados de forma segura. Nunca compartilhamos informações completas do cartão com terceiros.
      </p>
    </div>
  );
};
