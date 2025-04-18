
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="container max-w-md mx-auto px-4 pt-6">
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep 
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white" 
                  : step < currentStep 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            <span className="text-xs mt-1 text-gray-500">
              {step === 1 ? "Face" : step === 2 ? "Profile" : "Privacy"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
