
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Professional } from "@/types/Professional";
import ProfessionalCard from "@/components/search/ProfessionalCard";

interface ListViewProps {
  professionals: Professional[];
  resetAllFilters: () => void;
}

const ListView: React.FC<ListViewProps> = ({ professionals, resetAllFilters }) => {
  return (
    <div className="p-4 space-y-4">
      {professionals.length > 0 ? (
        professionals.map(pro => (
          <ProfessionalCard key={pro.id} professional={pro} />
        ))
      ) : (
        <div className="text-center py-8">
          <X className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">Nenhum profissional encontrado</p>
          <p className="text-sm text-gray-400">Tente ajustar seus filtros</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetAllFilters}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListView;
