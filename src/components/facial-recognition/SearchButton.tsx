
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface SearchButtonProps {
  isSearching: boolean;
  onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ isSearching, onClick }) => {
  return (
    <div className="mt-6 space-y-3">
      <Button 
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md" 
        onClick={onClick}
        disabled={isSearching}
      >
        {isSearching ? (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            Procurando...
          </div>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Encontrar Profissionais com Reconhecimento Facial
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 text-center px-4">
        Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
      </p>
    </div>
  );
};

export default SearchButton;
