
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, PlusCircle, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SubscriptionSectionProps {
  fadeIn: any;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ fadeIn }) => {
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [showPlans, setShowPlans] = useState(false);
  
  // Mock subscription plans
  const plans = [
    { 
      id: "basic", 
      name: "Plano Básico", 
      price: "Grátis", 
      features: ["Perfil básico", "Até 5 agendamentos/mês", "Suporte via email"],
      isCurrent: currentPlan === "basic",
      color: "bg-gray-100"
    },
    { 
      id: "pro", 
      name: "Plano Profissional", 
      price: "R$29,90/mês", 
      features: ["Perfil destacado", "Agendamentos ilimitados", "Taxa reduzida (7%)", "Suporte prioritário"],
      isCurrent: currentPlan === "pro",
      color: "bg-blue-100"
    },
    { 
      id: "premium", 
      name: "Plano Premium", 
      price: "R$49,90/mês", 
      features: ["Perfil em destaque nos resultados", "Agendamentos ilimitados", "Taxa mínima (5%)", "Suporte VIP 24/7", "Insights de negócio"],
      isCurrent: currentPlan === "premium",
      color: "bg-purple-100"
    }
  ];

  const handleChangePlan = (planId: string) => {
    if (planId !== "basic") {
      toast.success(`Plano ${planId === "pro" ? "Profissional" : "Premium"} ativado com sucesso!`);
    }
    setCurrentPlan(planId);
    setShowPlans(false);
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
                Será cobrado {currentPlan === "pro" ? "R$29,90" : "R$49,90"} no cartão terminado em 4242
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

      {/* Payment methods section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Métodos de Pagamento</h3>
          <Button variant="outline" size="sm" onClick={() => toast.info("Adicionar método de pagamento")}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Example payment method */}
        <div className="flex items-center justify-between p-3 border rounded-lg mb-3">
          <div className="flex items-center">
            <div className="w-10 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium">Visa terminando em 4242</p>
              <p className="text-xs text-gray-500">Expira em 04/2026</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-0">Principal</Badge>
        </div>
        
        <div className="p-3 bg-amber-50 rounded-lg flex items-start gap-2 border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-700">
            Suas informações de pagamento são armazenadas com segurança e nunca compartilhadas com terceiros.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default SubscriptionSection;
