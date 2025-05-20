
import React from "react";
import { Check, Zap } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

interface DateSelectedProps {
  selectedDate: Date;
  isUrgentDate: (date: Date) => boolean;
  isHighDemandDate: (date: Date) => boolean;
}

const DateSelected: React.FC<DateSelectedProps> = ({ 
  selectedDate,
  isUrgentDate,
  isHighDemandDate 
}) => {
  if (!selectedDate) return null;
  
  return (
    <motion.div 
      className="mt-3 text-center"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs text-purple-700 font-medium">
        {isUrgentDate(selectedDate) ? (
          <span className="flex items-center justify-center">
            <Check className="h-3 w-3 mr-1" />
            Disponibilidade confirmada para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </span>
        ) : isHighDemandDate(selectedDate) ? (
          <span className="flex items-center justify-center text-rose-600">
            <Zap className="h-3 w-3 mr-1" />
            Alta demanda em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} (preço dinâmico)
          </span>
        ) : (
          <span>
            Data selecionada: {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </span>
        )}
      </p>
    </motion.div>
  );
};

export default DateSelected;
