
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentMethodDialog from "./PaymentMethodDialog";
import { PaymentMethodList } from "./subscription/PaymentMethodList";
import { PlanSelector } from "./subscription/PlanSelector";
import { usePlans } from "./subscription/usePlans";
import { usePaymentMethods } from "./subscription/usePaymentMethods";

interface SubscriptionSectionProps {
  fadeIn: any;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ fadeIn }) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { plans, currentPlan, showPlans, setShowPlans, handleChangePlan } = usePlans();
  const { paymentMethods, handleAddCard, handleRemoveCard, handleSetDefaultCard } = usePaymentMethods();

  const selectedPlan = plans.find(p => p.id === currentPlan);

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

        <PlanSelector 
          plans={plans}
          currentPlan={currentPlan}
          showPlans={showPlans}
          onChangePlan={handleChangePlan}
          onTogglePlans={() => setShowPlans(!showPlans)}
        />
      </div>

      {/* Payment methods section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Métodos de Pagamento</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPaymentDialogOpen(true)}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <PaymentMethodList 
          paymentMethods={paymentMethods}
          onRemoveCard={handleRemoveCard}
          onSetDefaultCard={handleSetDefaultCard}
          onAddCard={() => setPaymentDialogOpen(true)}
        />
        
        <div className="p-3 bg-amber-50 rounded-lg flex items-start gap-2 border border-amber-200 mt-4">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-700">
            Suas informações de pagamento são armazenadas com segurança e nunca compartilhadas com terceiros.
          </p>
        </div>
      </div>

      {/* Service Fee Information Section */}
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

      <PaymentMethodDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSaveCard={handleAddCard}
      />
    </motion.section>
  );
};

export default SubscriptionSection;
