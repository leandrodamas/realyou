import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard, AlertCircle } from "lucide-react";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCard: (cardData: CardData) => void;
}

export interface CardData {
  number: string;
  name: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({ 
  open, 
  onOpenChange,
  onSaveCard
}) => {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expMonth: "",
    expYear: "",
    cvv: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => currentYear + i);
  };

  const validateCard = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!cardData.number.trim() || cardData.number.length < 13) {
      newErrors.number = "Número de cartão inválido";
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!cardData.expMonth) {
      newErrors.expMonth = "Mês é obrigatório";
    }
    
    if (!cardData.expYear) {
      newErrors.expYear = "Ano é obrigatório";
    }
    
    if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCard()) {
      onSaveCard(cardData);
      toast.success("Cartão adicionado com sucesso!");
      onOpenChange(false);
      
      // Reset form after successful submission
      setCardData({
        number: "",
        name: "",
        expMonth: "",
        expYear: "",
        cvv: ""
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            Adicionar Cartão de Crédito
          </DialogTitle>
          <DialogDescription>
            Adicione as informações do seu cartão de crédito abaixo.
            Seus dados estão seguros e criptografados.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="card-number">Número do Cartão</Label>
            <Input 
              id="card-number" 
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => {
                // Keep only digits
                const digits = e.target.value.replace(/\D/g, '');
                // Limit to 16 digits
                const formattedNumber = digits.slice(0, 16);
                handleInputChange('number', formattedNumber);
              }}
              className={errors.number ? "border-red-500" : ""}
              maxLength={16}
            />
            {errors.number && (
              <p className="text-red-500 text-xs">{errors.number}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-name">Nome no Cartão</Label>
            <Input 
              id="card-name" 
              placeholder="Nome completo como está no cartão"
              value={cardData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-month">Mês</Label>
              <Select 
                value={cardData.expMonth}
                onValueChange={(value) => handleInputChange('expMonth', value)}
              >
                <SelectTrigger className={errors.expMonth ? "border-red-500" : ""}>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.expMonth && (
                <p className="text-red-500 text-xs">{errors.expMonth}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exp-year">Ano</Label>
              <Select
                value={cardData.expYear}
                onValueChange={(value) => handleInputChange('expYear', value)}
              >
                <SelectTrigger className={errors.expYear ? "border-red-500" : ""}>
                  <SelectValue placeholder="AAAA" />
                </SelectTrigger>
                <SelectContent>
                  {generateYearOptions().map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expYear && (
                <p className="text-red-500 text-xs">{errors.expYear}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv" 
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  handleInputChange('cvv', digits.slice(0, 4));
                }}
                className={errors.cvv ? "border-red-500" : ""}
                maxLength={4}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 border border-blue-200 mt-4">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-700">
              Seus dados de cartão são criptografados e armazenados de forma segura. Nunca compartilhamos informações completas do cartão com terceiros.
            </p>
          </div>
          
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar Cartão</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
