
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Professional } from "@/types/Professional";
import ProfessionalCard from "@/components/search/ProfessionalCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ListViewProps {
  professionals: Professional[];
  resetAllFilters: () => void;
  isLoading?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ professionals, resetAllFilters, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {professionals.length > 0 ? (
        professionals.map(pro => (
          <ProfessionalCard key={`${pro.id}`} professional={pro} />
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
