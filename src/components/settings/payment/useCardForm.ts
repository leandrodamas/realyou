
import { useState } from "react";
import { type CardData, type CardFormErrors } from "./types";

export const useCardForm = (onSaveCard: (cardData: CardData) => void) => {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expMonth: "",
    expYear: "",
    cvv: ""
  });

  const [errors, setErrors] = useState<CardFormErrors>({});

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateCard = (): boolean => {
    const newErrors: CardFormErrors = {};
    
    if (!cardData.number.trim() || cardData.number.length < 13) {
      newErrors.number = "Número de cartão inválido";
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!cardData.expMonth) {
      newErrors.expMonth = "Mês é obrigatório";
    }
    
    if (!cardData.expYear) {
      newErrors.expYear = "Ano é obrigatório";
    }
    
    if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCard()) {
      onSaveCard(cardData);
      // Reset form after successful submission
      setCardData({
        number: "",
        name: "",
        expMonth: "",
        expYear: "",
        cvv: ""
      });
    }
  };

  return {
    cardData,
    errors,
    handleInputChange,
    handleSubmit
  };
};
