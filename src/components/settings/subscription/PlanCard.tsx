
import React from "react";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { type SubscriptionPlan } from "./types";

interface PlanCardProps {
  plan: SubscriptionPlan;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div 
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
  );
};
