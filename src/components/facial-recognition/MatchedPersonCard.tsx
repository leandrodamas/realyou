
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, User, Check } from "lucide-react";
import { motion } from "framer-motion";
import { MatchedPerson } from "./types/MatchedPersonTypes";

interface MatchedPersonCardProps {
  matchedPerson: MatchedPerson;
  connectionSent: boolean;
  onShowScheduleDialog: () => void;
  onSendConnectionRequest: () => void;
}

const MatchedPersonCard: React.FC<MatchedPersonCardProps> = ({
  matchedPerson,
  connectionSent,
  onShowScheduleDialog,
  onSendConnectionRequest,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 bg-white rounded-xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <img 
          src={matchedPerson.avatar} 
          alt={matchedPerson.name} 
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">{matchedPerson.name}</h3>
          <p className="text-xs text-gray-500">{matchedPerson.profession}</p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline"
          className="flex-1 text-sm h-9"
          onClick={onShowScheduleDialog}
        >
          <Clock className="h-4 w-4 mr-2" />
          Ver Horários
        </Button>
        
        <Button 
          className={`flex-1 text-sm h-9 ${connectionSent ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-purple-600 to-blue-500'}`}
          onClick={onSendConnectionRequest}
          disabled={connectionSent}
        >
          {connectionSent ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Solicitação Enviada
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Enviar Solicitação
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default MatchedPersonCard;
