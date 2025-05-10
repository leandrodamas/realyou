import React, { useState, useEffect } from "react";
import { DollarSign, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileStorage, DEFAULT_PROFILE } from "@/hooks/facial-recognition/useProfileStorage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServicePricingProps {
  isOwner?: boolean;
}

const ServicePricing: React.FC<ServicePricingProps> = ({ isOwner = false }) => {
  const { saveProfile, getProfile } = useProfileStorage();
  const profile = getProfile() || DEFAULT_PROFILE;
  
  const [isEditing, setIsEditing] = useState(false);
  const [basePrice, setBasePrice] = useState(profile.basePrice || 180);
  const [currency, setCurrency] = useState(profile.currency || "BRL");
  const [userId, setUserId] = useState<string | null>(null);
  const [pricingId, setPricingId] = useState<string | null>(null);
  
  const currencySymbols: Record<string, string> = {
    BRL: "R$",
    USD: "$",
    EUR: "€",
    GBP: "£"
  };
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        // Check if the user already has pricing info in the database
        const { data, error } = await supabase
          .from('service_pricing')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (!error && data) {
          // Update local state from database
          setPricingId(data.id);
          setBasePrice(data.base_price || basePrice);
          // Update profile storage
          saveProfile({
            ...profile,
            basePrice: data.base_price || basePrice,
            currency
          });
        }
      }
    };
    
    checkUser();
  }, []);
  
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(basePrice);
  
  const handleSave = async () => {
    try {
      // Save to profile storage
      saveProfile({
        ...profile,
        basePrice,
        currency
      });
      
      // If we have a user ID, also save to database
      if (userId) {
        if (pricingId) {
          // Update existing pricing record
          await supabase
            .from('service_pricing')
            .update({
              base_price: basePrice,
              updated_at: new Date().toISOString()
            })
            .eq('id', pricingId);
        } else {
          // Create new pricing record
          const { data, error } = await supabase
            .from('service_pricing')
            .insert({
              user_id: userId,
              base_price: basePrice,
              title: profile.title || "Serviço Profissional",
              description: "Serviço personalizado de alta qualidade"
            })
            .select();
            
          if (!error && data && data.length > 0) {
            setPricingId(data[0].id);
          }
        }
      }
      
      toast.success("Preço atualizado com sucesso!");
      setIsEditing(false);
      
      // Dispatch event to notify other components about the update
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: {...profile, basePrice, currency} } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao salvar preço:", error);
      toast.error("Não foi possível atualizar o preço");
    }
  };

  return (
    <div className="flex items-center">
      <DollarSign className="h-5 w-5 text-green-600 mr-3" />
      <div className="flex-1">
        <h4 className="font-medium">Preço</h4>
        
        {isEditing && isOwner ? (
          <div className="flex items-center gap-2 mt-1">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue placeholder="Moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">R$ (BRL)</SelectItem>
                <SelectItem value="USD">$ (USD)</SelectItem>
                <SelectItem value="EUR">€ (EUR)</SelectItem>
                <SelectItem value="GBP">£ (GBP)</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="h-8 w-24"
              min="0"
            />
            
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave} className="h-8">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-semibold">{formattedPrice}</p>
            {isOwner && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePricing;
