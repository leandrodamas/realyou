
import React from "react";
import { MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EmptyStateViewProps {
  onBecomeProfessional: () => void;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onBecomeProfessional }) => {
  const handleButtonClick = () => {
    console.log("Botão Tornar-se Profissional clicado");
    try {
      onBecomeProfessional();
      toast.success("Iniciando processo para se tornar profissional");
    } catch (error) {
      console.error("Erro ao processar clique:", error);
      toast.error("Não foi possível processar sua solicitação");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <MapIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
        <p className="text-gray-500 mb-6">Cadastre-se como profissional ou refine sua busca para encontrar profissionais na sua área</p>
        <Button onClick={handleButtonClick}>Tornar-se Profissional</Button>
      </div>
    </div>
  );
};

export default EmptyStateView;
