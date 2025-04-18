
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, AlertCircle } from "lucide-react";
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
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <CardForm 
            cardData={cardData}
            errors={errors}
            onInputChange={handleInputChange}
          />
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 border border-blue-200 mt-4">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-700">
              Seus dados de cartão são criptografados e armazenados de forma segura. Nunca compartilhamos informações completas do cartão com terceiros.
            </p>
          </div>
          
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar Cartão</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
