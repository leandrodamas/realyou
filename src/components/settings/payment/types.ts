
export interface CardData {
  number: string;
  name: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface CardFormErrors {
  number?: string;
  name?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;
}

export interface CardFormProps {
  cardData: CardData;
  errors: CardFormErrors;
  onInputChange: (field: keyof CardData, value: string) => void;
}
