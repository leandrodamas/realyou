import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  CheckCircle, 
  PlusCircle, 
  AlertCircle, 
  Calendar, 
  Trash2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import PaymentMethodDialog, { CardData } from "./PaymentMethodDialog";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";

interface SubscriptionSectionProps {
  fadeIn: any;
}

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "elo";
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ fadeIn }) => {
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [showPlans, setShowPlans] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
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
  
  // Mock subscription plans
  const plans = [
    { 
      id: "basic", 
      name: "Plano Básico", 
      price: "Grátis", 
      features: ["Perfil básico", "Até 5 agendamentos/mês", "Suporte via email"],
      isCurrent: currentPlan === "basic",
      color: "bg-gray-100",
      serviceFee: 7, // 7% de taxa de serviço
    },
    { 
      id: "pro", 
      name: "Plano Profissional", 
      price: "R$29,90/mês", 
      features: ["Perfil destacado", "Agendamentos ilimitados", "Taxa reduzida (7%)", "Suporte prioritário"],
      isCurrent: currentPlan === "pro",
      color: "bg-blue-100",
      serviceFee: 7, // 7% de taxa de serviço
    },
    { 
      id: "premium", 
      name: "Plano Premium", 
      price: "R$49,90/mês", 
      features: ["Perfil em destaque nos resultados", "Agendamentos ilimitados", "Taxa mínima (5%)", "Suporte VIP 24/7", "Insights de negócio"],
      isCurrent: currentPlan === "premium",
      color: "bg-purple-100",
      serviceFee: 5, // 5% de taxa de serviço
    }
  ];

  const handleChangePlan = (planId: string) => {
    if (planId !== "basic") {
      toast.success(`Plano ${planId === "pro" ? "Profissional" : "Premium"} ativado com sucesso!`);
    }
    setCurrentPlan(planId);
    setShowPlans(false);
  };

  const handleAddCard = (cardData: CardData) => {
    // In a real app, this would call an API to save the card
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

  // Helper function to determine card type from number
  const getCardType = (number: string): "visa" | "mastercard" | "amex" | "elo" => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === "4") return "visa";
    if (firstDigit === "5") return "mastercard";
    if (firstDigit === "3") return "amex";
    if (["63", "65"].includes(firstTwoDigits)) return "elo";
    
    return "visa"; // Default to Visa
  };

  // Helper function to get color and text for card type
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

  return (
    <motion.section variants={fadeIn} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Assinatura e Pagamentos</h2>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">Plano Atual</p>
            <p className="text-sm text-gray-500">
              {currentPlan === "basic" ? "Plano Básico (Gratuito)" : 
               currentPlan === "pro" ? "Plano Profissional" : "Plano Premium"}
            </p>
          </div>
          {currentPlan !== "basic" && (
            <Badge className="bg-green-100 text-green-700 border-0">
              Ativo
            </Badge>
          )}
        </div>

        {currentPlan !== "basic" && (
          <div className="p-3 bg-blue-50 rounded-lg mb-4 flex items-start gap-2">
            <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">Próxima cobrança: 15/05/2025</p>
              <p className="text-xs text-blue-600">
                Será cobrado {currentPlan === "pro" ? "R$29,90" : "R$49,90"} no cartão terminado em {paymentMethods.find(card => card.isDefault)?.last4 || "4242"}
              </p>
            </div>
          </div>
        )}

        <Button onClick={() => setShowPlans(!showPlans)} className="w-full justify-between">
          <span>{showPlans ? "Cancelar" : "Mudar plano"}</span>
          <PlusCircle className={`h-4 w-4 transition-transform ${showPlans ? "rotate-45" : ""}`} />
        </Button>
      </div>

      {showPlans && (
        <div className="space-y-4 mt-6">
          <p className="font-medium text-gray-700">Escolha um plano:</p>
          
          <RadioGroup value={currentPlan} onValueChange={handleChangePlan} className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg p-4 transition-all ${
                  plan.isCurrent ? "border-purple-400 ring-2 ring-purple-200" : "border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                  <div className="ml-2 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor={plan.id} className="font-medium">{plan.name}</Label>
                      <span className="font-semibold text-sm">{plan.price}</span>
                    </div>
                    <ul className="text-sm space-y-1 mt-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.isCurrent && (
                      <Badge className="mt-3 bg-purple-100 text-purple-700 border-0">
                        Plano atual
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {currentPlan !== "basic" && (
            <div className="pt-3 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full text-gray-600" 
                onClick={() => {
                  setCurrentPlan("basic");
                  toast("Assinatura cancelada com sucesso");
                  setShowPlans(false);
                }}
              >
                Cancelar assinatura
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Payment methods section - Enhanced */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Métodos de Pagamento</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPaymentDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Display payment methods */}
        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-6 border border-dashed rounded-lg">
              <CreditCard className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Nenhum cartão cadastrado</p>
              <Button 
                variant="link" 
                className="mt-1 text-purple-600"
                onClick={() => setPaymentDialogOpen(true)}
              >
                Adicionar um cartão agora
              </Button>
            </div>
          ) : (
            paymentMethods.map((card) => {
              const { bg, text, name } = getCardBrandStyle(card.type);
              return (
                <Card key={card.id} className="overflow-hidden">
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
                            onClick={() => handleSetDefaultCard(card.id)}
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
                            onClick={() => handleRemoveCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        
        <div className="p-3 bg-amber-50 rounded-lg flex items-start gap-2 border border-amber-200 mt-4">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-700">
            Suas informações de pagamento são armazenadas com segurança e nunca compartilhadas com terceiros.
          </p>
        </div>
      </div>

      {/* New Service Fee Information Section */}
      <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2 border border-blue-200 mt-4">
        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700 font-medium">Taxas de Serviço</p>
          {plans.map(plan => (
            <div key={plan.id} className="text-xs text-blue-600 mt-1">
              {plan.name}: {plan.serviceFee}% de taxa de serviço
            </div>
          ))}
          <p className="text-xs text-blue-500 mt-2">
            As taxas de serviço são deduzidas automaticamente de cada transação realizada através da plataforma.
          </p>
        </div>
      </div>

      {/* Payment Method Dialog */}
      <PaymentMethodDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSaveCard={handleAddCard}
      />
    </motion.section>
  );
};

export default SubscriptionSection;
