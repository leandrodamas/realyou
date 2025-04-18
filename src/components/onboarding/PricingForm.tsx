import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface PricingFormProps {
  onComplete: () => void;
}

const PricingForm: React.FC<PricingFormProps> = ({ onComplete }) => {
  const [priceValue, setPriceValue] = useState<number>(150);
  const [packageDescription, setPackageDescription] = useState<string>("");

  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setPriceValue(newValue);
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value)) {
      setPriceValue(0);
      return;
    }
    
    // Keep value within bounds
    const boundedValue = Math.min(Math.max(value, 50), 300);
    setPriceValue(boundedValue);
  };

  const handleSubmit = () => {
    if (packageDescription.trim() === "") {
      toast.warning("Por favor, adicione uma descrição para o pacote básico");
      return;
    }
    
    // Save pricing data (this could be stored in context or sent to an API)
    const pricingData = {
      basePrice: priceValue,
      packageDescription: packageDescription,
    };
    
    console.log("Pricing data:", pricingData);
    onComplete();
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Precificação</h3>
      
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-3 mb-3 text-white">
        <div className="flex items-center mb-2">
          <DollarSign className="h-5 w-5 mr-2" />
          <span className="font-medium">Dica de precificação</span>
        </div>
        <p className="text-sm opacity-90">
          Profissionais com preços alinhados ao mercado conseguem 40% mais clientes.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Valor base por hora
        </label>
        <div className="mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">R$50</span>
            <span className="text-sm text-gray-500">R$300</span>
          </div>
          <Slider
            min={50}
            max={300}
            step={5}
            value={[priceValue]}
            onValueChange={handleSliderChange}
          />
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-purple-600">R${priceValue}</span>
            <span className="text-gray-500 text-sm ml-1">/hora</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pacote Básico (descrição)
          </label>
          <Input 
            placeholder="Ex: 1 hora de consultoria" 
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              className="pl-8" 
              type="number"
              min="50"
              max="300"
              value={priceValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={handleSubmit}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PricingForm;
