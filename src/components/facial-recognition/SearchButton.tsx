
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SearchButtonProps {
  onClick: () => void;
  isSearching: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, isSearching }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full mt-6"
    >
      <Button
        onClick={onClick}
        className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 rounded-xl flex items-center justify-center gap-2"
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Buscando correspondências...</span>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            <span>Buscar correspondências de pessoas</span>
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-2">
        Este recurso utiliza reconhecimento facial para encontrar pessoas
        cadastradas no RealYou com características similares
      </p>
    </motion.div>
  );
};

export default SearchButton;
