
import React from "react";
import { Link } from "react-router-dom";
import { Map, Calendar, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const FeatureCards: React.FC = () => {
  return (
    <div className="mt-4 px-4 grid grid-cols-2 gap-3">
      <Link to="/advanced-search">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 h-full"
        >
          <div className="rounded-full bg-purple-100 w-10 h-10 flex items-center justify-center mb-2">
            <Map className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-base font-semibold mb-1">Busca 3D</h2>
          <p className="text-xs text-gray-600">Encontre profissionais próximos</p>
          <Badge className="mt-2 bg-purple-100 text-purple-700 border-0">Novo</Badge>
        </motion.div>
      </Link>
      
      <Link to="/timeline">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4 h-full"
        >
          <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold mb-1">Agenda Visual</h2>
          <p className="text-xs text-gray-600">Gerencie seus horários</p>
          <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">Dinâmico</Badge>
        </motion.div>
      </Link>
      
      <Link to="/onboarding">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-4 h-full"
        >
          <div className="rounded-full bg-amber-100 w-10 h-10 flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-base font-semibold mb-1">Perfil Completo</h2>
          <p className="text-xs text-gray-600">Ganhe pontos e mais visibilidade</p>
          <Badge className="mt-2 bg-amber-100 text-amber-700 border-0">Gamificado</Badge>
        </motion.div>
      </Link>
      
      <Link to="/search">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-4 h-full"
        >
          <div className="rounded-full bg-green-100 w-10 h-10 flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-base font-semibold mb-1">Match Pro</h2>
          <p className="text-xs text-gray-600">Descubra profissionais ideais</p>
          <Badge className="mt-2 bg-green-100 text-green-700 border-0">Inteligente</Badge>
        </motion.div>
      </Link>
    </div>
  );
};

export default FeatureCards;
