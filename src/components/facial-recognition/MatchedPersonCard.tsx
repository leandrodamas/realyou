
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { MatchedPerson } from "./types/MatchedPersonTypes";

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
      className="w-full bg-white rounded-xl shadow-xl overflow-hidden mt-6 border border-purple-100"
    >
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="rounded-full border-4 border-white h-24 w-24 overflow-hidden">
            <img
              src={matchedPerson.avatar}
              alt={matchedPerson.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-5 text-center">
        <h3 className="text-xl font-bold">{matchedPerson.name}</h3>
        <p className="text-gray-500">{matchedPerson.profession}</p>

        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={onShowScheduleDialog}
            variant="outline"
            className="flex items-center gap-2 justify-center"
          >
            <Calendar className="h-4 w-4" />
            Ver disponibilidade
          </Button>

          {connectionSent ? (
            <Button disabled className="bg-green-500 hover:bg-green-600">
              Solicitação enviada
            </Button>
          ) : (
            <Button
              onClick={onSendConnectionRequest}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
            >
              <Mail className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MatchedPersonCard;
