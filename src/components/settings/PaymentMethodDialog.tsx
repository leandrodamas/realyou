
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PaymentDialogHeader } from "./payment/PaymentDialogHeader";
import { PaymentDialogFooter } from "./payment/PaymentDialogFooter";
import { SecurityNotice } from "./payment/SecurityNotice";
import { CardForm } from "./payment/CardForm";
import { useCardForm } from "./payment/useCardForm";
import { type CardData } from "./payment/types";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCard: (cardData: CardData) => void;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({ 
  open, 
  onOpenChange,
  onSaveCard
}) => {
  const { cardData, errors, handleInputChange, handleSubmit } = useCardForm((data) => {
    onSaveCard(data);
    toast.success("Cartão adicionado com sucesso!");
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <PaymentDialogHeader />
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <CardForm 
            cardData={cardData}
            errors={errors}
            onInputChange={handleInputChange}
          />
          
          <SecurityNotice />
          <PaymentDialogFooter />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
