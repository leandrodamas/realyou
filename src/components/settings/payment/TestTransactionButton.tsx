
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const TestTransactionButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestTransaction = async () => {
    setIsLoading(true);
    try {
      // Usando UUIDs válidos para o teste
      const { data, error } = await supabase.functions.invoke('process-transaction', {
        body: {
          userId: "00000000-0000-4000-a000-000000000000", // UUID teste estático
          providerId: "00000000-0000-4000-a000-000000000001", // UUID teste estático
          amount: 1.00, // 1 real
          serviceFeePercentage: 5,
          description: "Transação de teste - R$1,00"
        }
      });

      if (error) throw error;

      toast.success("Transação de teste realizada com sucesso!", {
        description: `Valor: R$1,00 - Taxa de serviço: R$${data.serviceFeeAmount.toFixed(2)} - ID: ${data.transaction.id.substring(0, 8)}...`
      });
      
      console.log("Transação concluída:", data);
    } catch (error) {
      console.error("Erro na transação:", error);
      
      toast.error("Erro ao realizar transação de teste", {
        description: error.message || "Verifique os logs para mais detalhes"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline"
      onClick={handleTestTransaction}
      disabled={isLoading}
      className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
    >
      {isLoading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processando...
        </>
      ) : (
        "Testar Cartão (R$1,00)"
      )}
    </Button>
  );
};
