
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

      <PaymentMethodDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSaveCard={handleAddCard}
      />
    </motion.section>
  );
};

export default SubscriptionSection;
