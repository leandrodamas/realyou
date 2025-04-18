
import { useState } from "react";
import { toast } from "sonner";
import { type PaymentMethod } from "./types";
import { type CardData } from "../PaymentMethodDialog";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expMonth: "04",
      expYear: "2026",
      isDefault: true
    }
  ]);

  const handleAddCard = (cardData: CardData) => {
    const cardType = getCardType(cardData.number);
    const last4 = cardData.number.slice(-4);
    
    const newCard: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: cardType,
      last4,
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods(prev => [...prev, newCard]);
  };

  const handleRemoveCard = (cardId: string) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
    toast.success("Cartão removido com sucesso");
  };

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    toast.success("Cartão definido como principal");
  };

  const getCardType = (number: string): "visa" | "mastercard" | "amex" | "elo" => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    if (firstDigit === "3") return "amex";
    if (["63", "65"].includes(firstTwoDigits)) return "elo";
    
    return "visa";
  };

  return {
    paymentMethods,
    handleAddCard,
    handleRemoveCard,
    handleSetDefaultCard,
  };
};
