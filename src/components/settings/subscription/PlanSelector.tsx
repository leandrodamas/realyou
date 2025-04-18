
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { type SubscriptionPlan } from "./types";
import { PlanCard } from "./PlanCard";
import { toast } from "sonner";

interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  currentPlan: string;
  showPlans: boolean;
  onChangePlan: (planId: string) => void;
  onTogglePlans: () => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  currentPlan,
  showPlans,
  onChangePlan,
  onTogglePlans,
}) => {
  return (
    <>
      <Button onClick={onTogglePlans} className="w-full justify-between">
        <span>{showPlans ? "Cancelar" : "Mudar plano"}</span>
        <PlusCircle className={`h-4 w-4 transition-transform ${showPlans ? "rotate-45" : ""}`} />
      </Button>

      {showPlans && (
        <div className="space-y-4 mt-6">
          <p className="font-medium text-gray-700">Escolha um plano:</p>
          
          <RadioGroup value={currentPlan} onValueChange={onChangePlan} className="space-y-4">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </RadioGroup>
          
          {currentPlan !== "basic" && (
            <div className="pt-3 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full text-gray-600" 
                onClick={() => {
                  onChangePlan("basic");
                  toast.success("Assinatura cancelada com sucesso");
                }}
              >
                Cancelar assinatura
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
