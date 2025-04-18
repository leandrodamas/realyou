
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { type PaymentMethod } from "./types";

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onRemoveCard: (cardId: string) => void;
  onSetDefaultCard: (cardId: string) => void;
  onAddCard: () => void;
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  paymentMethods,
  onRemoveCard,
  onSetDefaultCard,
  onAddCard,
}) => {
  const getCardBrandStyle = (type: string): { bg: string; text: string; name: string } => {
    switch (type) {
      case "visa":
        return { bg: "bg-blue-500", text: "text-white", name: "VISA" };
      case "mastercard":
        return { bg: "bg-orange-500", text: "text-white", name: "MASTERCARD" };
      case "amex":
        return { bg: "bg-green-500", text: "text-white", name: "AMEX" };
      case "elo":
        return { bg: "bg-yellow-500", text: "text-black", name: "ELO" };
      default:
        return { bg: "bg-gray-500", text: "text-white", name: "CARTÃO" };
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed rounded-lg">
        <CreditCard className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Nenhum cartão cadastrado</p>
        <Button 
          variant="link" 
          className="mt-1 text-purple-600"
          onClick={onAddCard}
        >
          Adicionar um cartão agora
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((card) => {
        const { bg, text, name } = getCardBrandStyle(card.type);
        return (
          <Card key={card.id}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center">
                  <div className={`w-12 h-8 ${bg} rounded mr-3 flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${text}`}>{name}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name} terminando em {card.last4}</p>
                    <p className="text-xs text-gray-500">Expira em {card.expMonth}/{card.expYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.isDefault ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Principal</Badge>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSetDefaultCard(card.id)}
                      className="text-xs"
                    >
                      Definir como principal
                    </Button>
                  )}
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-gray-700"
                      onClick={() => toast.info("Editar cartão")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => onRemoveCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
