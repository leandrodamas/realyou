
export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "elo";
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrent: boolean;
  color: string;
  serviceFee: number;
}
