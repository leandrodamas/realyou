
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CardFormProps } from "./types";

export const CardForm: React.FC<CardFormProps> = ({
  cardData,
  errors,
  onInputChange,
}) => {
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => currentYear + i);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-number">Número do Cartão</Label>
        <Input 
          id="card-number" 
          placeholder="1234 5678 9012 3456"
          value={cardData.number}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            onInputChange('number', digits.slice(0, 16));
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
          onChange={(e) => onInputChange('name', e.target.value)}
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
            onValueChange={(value) => onInputChange('expMonth', value)}
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
            onValueChange={(value) => onInputChange('expYear', value)}
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
              onInputChange('cvv', digits.slice(0, 4));
            }}
            className={errors.cvv ? "border-red-500" : ""}
            maxLength={4}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};
