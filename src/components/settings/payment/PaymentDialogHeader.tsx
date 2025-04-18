
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

export const PaymentDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-purple-500" />
        Adicionar Cartão de Crédito
      </DialogTitle>
      <DialogDescription>
        Adicione as informações do seu cartão de crédito abaixo.
        Seus dados estão seguros e criptografados.
      </DialogDescription>
    </DialogHeader>
  );
};
