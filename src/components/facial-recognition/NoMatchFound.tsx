
import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NoMatchFoundProps {
  onReset: () => void;
}

const NoMatchFound: React.FC<NoMatchFoundProps> = ({ onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 text-orange-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <h3 className="font-medium">Nenhuma correspondência encontrada</h3>
      </div>
      <p className="text-sm text-orange-600 mt-2">
        Não encontramos ninguém com esse rosto em nossa base de dados.
        Tente novamente com iluminação melhor ou ângulo diferente.
      </p>
      <Button 
        variant="outline" 
        className="mt-3 w-full border-orange-300 text-orange-700 hover:bg-orange-100"
        onClick={onReset}
      >
        Tentar Novamente
      </Button>
    </motion.div>
  );
};

export default NoMatchFound;
