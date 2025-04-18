
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePlans } from "./usePlans";

export const SubscriptionPlanTest: React.FC = () => {
  const { plans, handleChangePlan } = usePlans();

  const testPlanChange = async (planId: string) => {
    try {
      console.log(`Testing plan change to: ${planId}`);
      
      // Trigger plan change
      await handleChangePlan(planId);

      // Additional verification steps
      const selectedPlan = plans.find(p => p.id === planId);
      
      if (selectedPlan) {
        toast.success(`Plan change test for ${selectedPlan.name} initiated`, {
          description: `Price: ${selectedPlan.price}, Service Fee: ${selectedPlan.serviceFee}%`
        });
        
        // Log detailed plan information
        console.log('Selected Plan Details:', {
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          serviceFee: selectedPlan.serviceFee,
          features: selectedPlan.features
        });
      }
    } catch (error) {
      console.error('Plan change test failed:', error);
      toast.error('Erro ao testar mudança de plano', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h2 className="text-lg font-semibold">Teste de Planos de Assinatura</h2>
      <div className="flex space-x-2">
        {plans.map(plan => (
          <Button 
            key={plan.id} 
            onClick={() => testPlanChange(plan.id)}
            variant={plan.isCurrent ? "default" : "outline"}
          >
            Testar {plan.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
