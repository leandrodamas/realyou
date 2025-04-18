
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type SubscriptionPlan } from "./types";

export const usePlans = () => {
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [showPlans, setShowPlans] = useState(false);

  const plans: SubscriptionPlan[] = [
    { 
      id: "basic", 
      name: "Plano Básico", 
      price: "Grátis", 
      features: ["Perfil básico", "Até 5 agendamentos/mês", "Suporte via email"],
      isCurrent: currentPlan === "basic",
      color: "bg-gray-100",
      serviceFee: 7,
    },
    { 
      id: "pro", 
      name: "Plano Profissional", 
      price: "R$29,90/mês", 
      features: ["Perfil destacado", "Agendamentos ilimitados", "Taxa reduzida (7%)", "Suporte prioritário"],
      isCurrent: currentPlan === "pro",
      color: "bg-blue-100",
      serviceFee: 7,
    },
    { 
      id: "premium", 
      name: "Plano Premium", 
      price: "R$49,90/mês", 
      features: ["Perfil em destaque nos resultados", "Agendamentos ilimitados", "Taxa mínima (5%)", "Suporte VIP 24/7", "Insights de negócio"],
      isCurrent: currentPlan === "premium",
      color: "bg-purple-100",
      serviceFee: 5,
    }
  ];

  const handleChangePlan = async (planId: string) => {
    try {
      if (planId !== "basic") {
        const selectedPlan = plans.find(p => p.id === planId);
        if (!selectedPlan) return;

        const { data, error } = await supabase.functions.invoke('create-subscription-plan', {
          body: {
            planName: selectedPlan.name,
            amount: planId === "pro" ? 29.90 : 49.90,
            currency: "BRL",
            billingDay: 10,
            trialPeriodMonths: 1
          }
        });

        if (error) throw error;

        if (data.plan.init_point) {
          window.open(data.plan.init_point, '_blank');
        }

        toast.success(`Plano ${selectedPlan.name} selecionado com sucesso!`);
      }
      setCurrentPlan(planId);
      setShowPlans(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Erro ao criar assinatura. Por favor tente novamente.');
    }
  };

  return {
    plans,
    currentPlan,
    showPlans,
    setShowPlans,
    handleChangePlan
  };
};
