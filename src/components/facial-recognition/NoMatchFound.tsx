
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface NoMatchFoundProps {
  onReset: () => void;
}

const NoMatchFound: React.FC<NoMatchFoundProps> = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full bg-white rounded-xl shadow overflow-hidden mt-6 p-6 border border-gray-200"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">😕</span>
        </div>
        <h3 className="text-xl font-medium">Nenhuma correspondência encontrada</h3>
        <p className="text-gray-500">
          Não encontramos nenhum usuário com características faciais semelhantes. Tente novamente com outra foto ou ângulo
          diferente.
        </p>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2 mt-4"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </motion.div>
  );
};

export default NoMatchFound;
